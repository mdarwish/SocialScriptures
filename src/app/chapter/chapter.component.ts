import { Component, OnInit, Input } from "@angular/core";
import { EsearchService } from "./../esearch.service";
import { SharedService } from "./../shared.service";
import { Logger } from "@nsalaun/ng-logger";

@Component({
  selector: "app-chapter",
  templateUrl: "./chapter.component.html",
  styleUrls: ["./chapter.component.css"]
})
export class ChapterComponent implements OnInit {
  @Input() cid = -1;
  @Input() bname = "";
  selectedBook: string;
  selectedChapter: number;
  selectedVerse: number;
  currentPage = 1;
  maxNumVersePPage = 10;
  totalVerses = 0;
  showPrev = true;
  showNext = true;
  chapter: any;
  verses: any;
  lazyLoad = "active";

  constructor(
    private es: EsearchService,
    private sharedSearch: SharedService,
    private logger: Logger
  ) {}

  ngOnInit() {
    if (this.bname === "" && this.cid === -1) {
      this.sharedSearch.selectedBook.subscribe(newBook =>
        this.changeBook(newBook)
      );
      this.sharedSearch.selectedChapter.subscribe(
        newCapter => (this.selectedChapter = newCapter)
      );
      this.sharedSearch.selectedVerse.subscribe(
        newVerse => (this.selectedVerse = newVerse)
      );
      this.getFullChapter(this.selectedBook, this.selectedChapter);
    } else {
      this.getFullChapter(this.bname, this.cid);
    }
  }

  getDefaultChapter() {
    this.logger.info("Retrieving default chapter...");
    this.es.getChapter("quran", 1).then(response => {
      this.chapter = response.hits.hits[0];
    });
    this.es.getChapterVerses(this.maxNumVersePPage, 0, "quran", 1).then(response => {
      this.verses = response.hits.hits;
      this.totalVerses = response.hits.total;
      if (this.totalVerses > this.maxNumVersePPage + this.currentPage) {
        this.showNext = true;
      }
    });
  }

  changeBook(newBook: string) {
    if (this.bname === "" && this.cid === -1) {
      this.selectedBook = newBook;
      this.selectedChapter = 1;
      this.getFullChapter(this.selectedBook, this.selectedChapter);
    }
  }

  changeChapter(newChapter: number) {
    if (this.bname === "" && this.cid === -1) {
      this.selectedChapter = newChapter;
      this.getFullChapter(this.selectedBook, this.selectedChapter);
    }
  }

  getFullChapter(book, cid) {
    this.logger.info("Retrieving chapter: ", cid, " of ", book,"...");
    this.lazyLoad = "active";
    this.es.getChapter(book, cid).then(response => {
      this.chapter = response.hits.hits[0];
    });
    this.logger.info("Retrieving verses for chapter: ", cid, " of ", book,"...");
    this.es.getChapterVerses(this.maxNumVersePPage, 0, book, cid).then(response => {
      this.verses = response.hits.hits;
      this.totalVerses = response.hits.total;
      this.lazyLoad = "";
      this.logger.info("Verses for chapter: ", cid, " of ", book," retrieved.");
      if (this.totalVerses > this.maxNumVersePPage + this.currentPage) {
        this.showNext = true;
      } else {
        this.showNext = false;
      }
      if (this.currentPage > 1) {
        this.showPrev = true;
      } else {
        this.showPrev = false;
      }
    });
  }
}
