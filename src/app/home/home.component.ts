import { Component, OnInit } from '@angular/core';

import { SharedService } from "./../shared.service";
import { EsearchService } from "./../esearch.service";
import { Logger } from '@nsalaun/ng-logger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  aggregations: any;

  constructor(private sharedSearch: SharedService, private repo: EsearchService, private logger: Logger) {
    if (this.repo && this.repo.isAvailable()) {
         this.logger.info('Successfully connected to EService');
    }
  }

  ngOnInit() {
    this.sharedSearch.aggregations.subscribe(
      newAggs => (this.aggregations = newAggs)
    );
  }
}
