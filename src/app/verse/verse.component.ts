import { Http } from '@angular/http';
import { Component, OnInit , Input, HostListener, Output} from '@angular/core';
import { EsearchService } from './../esearch.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng-logger';

@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.css']
})
export class VerseComponent implements OnInit {
  @Input() chapter: any;
  @Input() verse: any;

  private commentsSource = new BehaviorSubject<any>(null);
  comments = this.commentsSource.asObservable();


  social_interactions: any = {
    "likes": 0,
    "comments": 0,
    "links": 0,
    "photos": 0,
    "shares": 0,
    "videos": 0
  };

  userComment = null;
  commentsExpanded = false;
  expand = false;
  liked = false;
  titleCollapse = 'title';
  contentCollapse = 'content';
  transition = 'transition visible';
  chMeta: any;

  constructor(private es: EsearchService, private logger: Logger) { }

  ngOnInit() {
    this.commentsSource.subscribe(newComments => this.comments = newComments);
    if ( this.verse._source.social_agregates !== undefined ) {
      this.social_interactions = this.verse._source.social_agregates;
    }
    this.getComments();
    if (this.chapter === undefined && this.chMeta === undefined) {
      this.getChapter();
    }
    else if (this.chapter !== undefined) {
      this.chMeta = this.chapter;
    }
  }

  getChapter() {
    this.es.getChapter(this.verse._source.type, this.verse._source.chapter).then(
      response => {
        this.setChapter(response.hits.hits[0]);
      }
    );
  }

  setChapter(data) {
    this.chapter = this.chMeta = data;
     this.logger.info("chapter: " + this.chapter);
     this.logger.info("chMeta" + this.chMeta);
  }

 toggleExpand(): void {
    this.expand = !this.expand;
    this.titleCollapse = (this.expand) ? 'title active' : 'title';
    this.contentCollapse = (this.expand) ? 'content active' : 'content';
    // this.transition = (this.transition) ? 'transition visible' : 'transition';
  }

  addLike(): void {
    this.es.addLike(this.verse._source.bid).subscribe(
      data => this.likeAdded(),
      error => this.updateFailed(error),
      () =>  this.logger.info("Request Completed")
    );
    this.es.getLikesCount(this.verse._source.bid).subscribe(
      data => (data.count === 0 ) ? this.social_interactions.likes++ : this.social_interactions.likes = data.count + 1,
      error =>  this.logger.info("Error getting likes!"),
      () =>  this.logger.info("Request Completed")
    );
  }

  likeAdded(): void {
    const payload = {
      "script" : "ctx._source.social_agregates.likes += 1"
    };

    this.es.updateVerse(this.verse._source.bid, payload).subscribe(
      data =>  this.logger.info("Likes updated successfully! server response = " + data.results),
      error => this.updateFailed(error),
      () =>  this.logger.info("Request Completed")
    );
  }

  updateFailed(error: any): void {
     this.logger.info("Update failed! error: " + error);
  }

  addComment(event: KeyboardEvent): void {
    if ( event.keyCode === 13 && this.userComment.length > 0 ) {
      this.es.addComment(this.verse._source.bid, this.userComment).subscribe(
        data => this.commentAdded(),
        error => this.updateFailed(error),
        () =>  this.logger.info("Request Completed")
      );
    }
  }

  commentAdded(): void {
    this.userComment = "";
    const payload: any = {
      "script" : "ctx._source.social_agregates.comments += 1"
    };

    this.es.updateVerse(this.verse._source.bid, payload).subscribe(
      data => this.getComments(),
      error => this.updateFailed(error),
      () =>  this.logger.info("Request Completed")
    );
    this.es.getCommentsCount(this.verse._source.bid).subscribe(
      data => (data.count === 0 ) ? this.social_interactions.comments++ : this.social_interactions.comments = data.count + 1,
      error =>  this.logger.info("Error getting comments!"),
      () => [ this.logger.info("Request Completed"), this.userComment = ""]
    );
  }

  toggleComments(): void {
    this.commentsExpanded = !this.commentsExpanded;
    this.getComments();
  }

  getComments(): void {
    this.es.getComments(this.verse._source.bid).subscribe(
      data => this.commentsSource.next(data.hits.hits),
      error =>  this.logger.info("Error getting comments!"),
      () => [ this.logger.info("Request Completed"), this.userComment = ""]
    );
  }

}

