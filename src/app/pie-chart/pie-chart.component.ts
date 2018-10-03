import { Component, ViewEncapsulation, OnInit, Input } from "@angular/core";
import { SharedService } from "./../shared.service";
import { EsearchService } from "./../esearch.service";

import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";

@Component({
    selector: "app-pie-chart",
    encapsulation: ViewEncapsulation.None,
    templateUrl: "./pie-chart.component.html",
    styleUrls: ["./pie-chart.component.css"]
})
export class PieChartComponent implements OnInit {
    @Input() data: any;
    aggregations: any;

    title = "Pie Chart";

    private margin = { top: 20, right: 20, bottom: 30, left: 50 };
    private width: number;
    private height: number;
    private radius: number;

    private arc: any;
    private labelArc: any;
    private pie: any;
    private color: any;
    private svg: any;

    constructor(private sharedSearch: SharedService, private repo: EsearchService) {
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.radius = Math.min(this.width, this.height) / 2;
    }

    ngOnInit() {
      this.sharedSearch.aggregations.subscribe(
        newAggs => (this.aggregations = newAggs)
      );
      this.initSvg();
      this.drawPie();
    }

    private initSvg() {
        this.color = d3Scale
            .scaleOrdinal()
            .range([
                "#98abc5",
                "#6b486b",
                "#ff8c00",
                "#8a89a6",
                "#7b6888",
                "#a05d56",
                "#d0743c"
            ]);
        this.arc = d3Shape
            .arc()
            .outerRadius(this.radius - 10)
            .innerRadius(0);
        this.labelArc = d3Shape
            .arc()
            .outerRadius(this.radius - 40)
            .innerRadius(this.radius - 40);
        this.pie = d3Shape
            .pie()
            .sort(null)
            .value((d: any) => d.doc_count);
        this.svg = d3
            .select("svg")
            .attr("width", "80%")
            .attr("height", "80%")
            .attr(
                "viewBox",
                "0 0 " +
                    Math.min(this.width, this.height) +
                    " " +
                    Math.min(this.width, this.height)
            )
            .attr("preserveAspectRatio", "xMinYMin")
            .append("g")
            .attr(
                "transform",
                "translate(" +
                    Math.min(this.width, this.height) / 2 +
                    "," +
                    Math.min(this.width, this.height) / 2 +
                    ")"
            );
    }

    private drawPie() {
        let g = this.svg
            .selectAll(".arc")
            .data(this.pie(this.aggregations))
            .enter()
            .append("g")
            .attr("class", "arc");
        g.append("path")
            .attr("d", this.arc)
            .style("fill", (d: any) => this.color(d.data.key));
        g.append("text")
            .attr(
                "transform",
                (d: any) => "translate(" + this.labelArc.centroid(d) + ")"
            )
            .attr("dy", ".35em")
            .text((d: any) => d.data.key);
    }
}
