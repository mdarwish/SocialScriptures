import { Component, OnInit } from "@angular/core";
import { EsearchService } from "./../esearch.service";
import { SharedService } from "./../shared.service";
import { Logger } from '@nsalaun/ng-logger';

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.css"]
})
export class BookComponent implements OnInit {
  selectedBook: string;
  chapters: any;
  bookMeta: string;
  selectedChapter: number;
  selectedVerse: number;
  currentPage = 0;
  maxNumVersePPage = 10;
  maxChaptersPPage = 3;
  maxChapters = 500;
  showNext = true;
  showPrev = false;
  lazyLoad = "active";

  constructor(
    private es: EsearchService,
    private sharedSearch: SharedService,
    private logger: Logger
  ) {}

  ngOnInit() {
    this.sharedSearch.selectedBook.subscribe(newBook =>
      this.changeBook(newBook)
    );
    this.sharedSearch.selectedChapter.subscribe(
      newCapter => (this.selectedChapter = newCapter)
    );
    this.sharedSearch.selectedVerse.subscribe(
      newVerse => (this.selectedVerse = newVerse)
    );
    // this.sharedSearch.resultsPerPage.subscribe(newResultsPerPage => this.maxNumVersePPage = newResultsPerPage);
    this.getBookChapters();
  }

  changeBook(newBook: string) {
    this.lazyLoad = "active";
    this.selectedBook = newBook;
    this.selectedChapter = 1;
    this.currentPage = 0;
    this.showNext = true;
    this.showPrev = false;
    this.logger.info("Changing book to: ",this.selectedBook);
    this.getBookChapters();
  }

  changeChapter(newChapter: number) {
    this.lazyLoad = "active";
    this.selectedChapter = newChapter;
    this.getChapters(this.selectedBook, this.selectedChapter);
    this.lazyLoad = "";
  }

  getBookChapters() {
    this.lazyLoad = "active";
    this.logger.info("Retrieving chapters for ",this.selectedBook);
    this.es
      .getBookChapters(this.maxChapters, this.currentPage, this.selectedBook)
      .then(response => {
        this.chapters = response.hits.hits;
        this.maxChapters = response.hits.total;
        this.lazyLoad = "";
      });
  }

  getChapters(book, cid) {
    this.lazyLoad = "active";
    this.logger.info("Retrieving chapter " + cid + " of  " + book);
    this.es.getChapter(book, cid).then(response => {
      this.chapters = response.hits.hits[0];
      this.logger.info("Chapter ", cid, " retrieved.");
      //this.logger.log(response.hits);
    });
    this.logger.info("Retrieving verses for chapter: "+ cid+ " of  "+ book);
    this.es.getChapterVerses(this.maxNumVersePPage, 0, book, cid).then(response => {
      this.chapters[cid].verses = response.hits.hits;
      this.chapters[cid].totalVerses = response.hits.total;
      this.logger.info("Verses for chapter: ", cid, " retrieved.");
      //this.logger.log(response.hits);
      this.lazyLoad = "";
      if (
        this.chapters[cid].totalVerses >
        this.maxNumVersePPage + this.currentPage
      ) {
        this.showNext = true;
      }
    });
  }

  onNext() {
    if (this.currentPage + this.maxChaptersPPage < this.maxChapters) {
      this.currentPage++;
      this.showPrev = true;
      this.showNext = true;
    } else {
      this.showNext = false;
      this.currentPage++;
    }
  }

  onPrev() {
    if (this.currentPage > 1) {
      this.showPrev = true;
      this.currentPage--;
    } else {
      this.showPrev = false;
      this.currentPage--;
    }
  }
}
