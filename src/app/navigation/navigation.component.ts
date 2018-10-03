import { SharedService } from './../shared.service';
import { Component, OnInit, Input } from '@angular/core';
import { EsearchService } from './../esearch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {
  searchTerm: string;
  selectedBook: string;
  selectedChapter: number;
  selectedVerse: number;

  constructor(private sharedSearch: SharedService, private es: EsearchService, private router: Router) {

  }

  ngOnInit() {
    this.sharedSearch.currentSearchTerm.subscribe(newTerm => this.searchTerm = newTerm);
    this.sharedSearch.selectedBook.subscribe(newBook => this.selectedBook = newBook);
    this.sharedSearch.selectedChapter.subscribe(newCapter => this.selectedChapter = newCapter);
    this.sharedSearch.selectedVerse.subscribe(newVerse => this.selectedVerse = newVerse);
  }

  compileSearch() {
    this.sharedSearch.changeTerm(this.searchTerm);
    this.router.navigate(["/search"]);
  }

  selectBook(book: string): void {
    this.sharedSearch.changeTerm("");
    this.sharedSearch.changeBook(book);
    this.router.navigate(["/home"]);
  }

}
