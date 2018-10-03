import { SharedService } from "./../shared.service";
import { EsearchService } from "./../esearch.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  searchResults: any;
  resultCount = 0;
  expand = true;
  titleCollapse = "title active";
  contentCollapse = "content active";
  transition = "transition visible";
  searchTerm: string;
  currentPage = 0;
  maxNumVersePPage = 10;
  showNext = true;
  showPrev = false;
  nOfPages = 0;

  constructor(
    private sharedSearch: SharedService,
    private es: EsearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sharedSearch.currentSearchTerm.subscribe(
      newTerm => (this.searchTerm = newTerm)
    );
    this.sharedSearch.searchResults.subscribe(
      newResults => (this.searchResults = newResults)
    );
    this.sharedSearch.resultCount.subscribe(
      newCount => (this.resultCount = newCount)
    );
    this.nOfPages = this.resultCount / this.maxNumVersePPage;
  }

  getChapter(book: string, cid: string) {
    return this.es.getChapter(book, +cid);
  }

  toggleExpand(): void {
    this.expand = !this.expand;
    this.titleCollapse = this.expand ? "title active" : "title";
    this.contentCollapse = this.expand ? "content active" : "content";
    this.transition = this.transition ? "transition visible" : "transition";
  }
  onNext() {
    this.nOfPages = this.resultCount / this.maxNumVersePPage;
    if (
      this.currentPage * this.maxNumVersePPage + this.maxNumVersePPage <=
      this.resultCount
    ) {
      this.currentPage++;
      if(!this.showPrev) {
        this.showPrev = true;
      }
      this.showNext = true;
    } else {
      this.showNext = false;
    }
  }

  onPrev() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.showPrev = true;
    } else {
      this.currentPage--;
      this.showPrev = false;
    }
  }
}
