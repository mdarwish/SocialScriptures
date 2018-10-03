import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { EsearchService } from './esearch.service';
import { Logger } from '@nsalaun/ng-logger';


@Injectable()
export class SharedService {
  // Synched properties
  private selectedBookSource = new BehaviorSubject<string>("quran") ;
  selectedBook = this.selectedBookSource.asObservable();
  private currentPageSource = new BehaviorSubject<number>(1) ;
  currentPage = this.currentPageSource.asObservable();
  private selectedChapterSource = new BehaviorSubject<number>(1) ;
  selectedChapter = this.selectedChapterSource.asObservable();
  private selectedVerseSource = new BehaviorSubject<number>(1) ;
  selectedVerse = this.selectedVerseSource.asObservable();
  private showCommentSource = new BehaviorSubject<boolean>(false) ;
  showComments = this.showCommentSource.asObservable();
  private currentChapterVersesSource = new BehaviorSubject<any>({});
  selectedChapterVerses = this.currentChapterVersesSource.asObservable();
  private chaptersMetaSource = new BehaviorSubject<any>({});
  chaptersMeta = this.chaptersMetaSource.asObservable();
  private RPPSource = new BehaviorSubject<number>(10) ;
  resultsPerPage = this.RPPSource.asObservable();
  private searchSource = new BehaviorSubject<string>(null) ;
  currentSearchTerm = this.searchSource.asObservable();
  private resultsSource = new BehaviorSubject<any>([]);
  searchResults = this.resultsSource.asObservable();
  private countSource = new BehaviorSubject<number>(0);
  resultCount = this.countSource.asObservable();
  private lazyLoadSource = new BehaviorSubject<string>("active");
  lazyLoad = this.lazyLoadSource.asObservable();
  private aggregationsSource = new BehaviorSubject<any>({});
  aggregations = this.aggregationsSource.asObservable();

  constructor(private es: EsearchService, private logger: Logger) {
    this.getChaptersMeta();
   }

   getChaptersMeta() {
     if (Object.getOwnPropertyNames(this.chaptersMetaSource.value).length === 0) {
      return this.es.getChaptersMeta().subscribe(
        data => this.chaptersMetaLoaded(data),
        error => this.searchFailed(error),
        () => this.logger.info("Request Completed")
       );
     }
   }

  chaptersMetaLoaded(data) {
    //this.logger.log(data);
    this.chaptersMetaSource.next(data.hits.hits);
   }

  changeTerm(newTerm: string) {
    this.searchSource.next(newTerm);
    this.performSearch(newTerm);
  }

  performSearch(query) {
    this.getChaptersMeta();
    return this.es.searchAll(query).then(response => {
      this.searchSuccess(response);
    });
/*
    .subscribe(
      data => this.searchSuccess(data),
      error => this.searchFailed(error),
      () =>  this.logger.log("Request Completed")
    );
 */
}

  searchSuccess(data) {
    //this.logger.log(data);
    this.countSource.next(data.hits.total);
    this.resultsSource.next(data.hits.hits);
    this.aggregationsSource.next(data.aggregations.chapter.buckets);
  }

  searchFailed(error) {
     this.logger.error(error);
  }

  changeBook(newBook: string) {
    this.getChaptersMeta();
    //this.currentPageSource.next(1)
    this.selectedBookSource.next(newBook);
    this.selectedChapterSource.next(1);
    this.es.getChapterVerses(10, 0, newBook, 1);
  }

  getChapterMeta() {

  }

  activateLazyLoad(state = "active") {
    this.lazyLoadSource.next(state);
  }
}
