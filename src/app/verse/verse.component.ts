import { Http } from '@angular/http';
import { Component, OnInit , Input, HostListener, Output} from '@angular/core';
import { EsearchService } from './../esearch.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from '@nsalaun/ng-logger';
import {TransitionController, Transition, TransitionDirection} from "ng2-semantic-ui";

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
  commentsExpanded = true;
  expand = false;
  liked = false;
  titleCollapse = 'title';
  contentCollapse = 'content';
  transition = 'transition visible';
  chMeta: any;

  public transitionController;
  public animate(transitionName:string = "fade") {
    if(this.expand)
    {
      this.transitionController.animate(
        new Transition(transitionName, 600, TransitionDirection.In, () => console.log("Completed transition.")));
    }
    else {
      this.transitionController.animate(
        new Transition(transitionName, 600, TransitionDirection.Out, () => console.log("Completed transition.")));
    }
 }

  constructor(private es: EsearchService, private logger: Logger) { 
    this.transitionController = new TransitionController();
  }

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
    this.animate();
    this.titleCollapse = (this.expand) ? 'title active' : 'title';
    this.contentCollapse = (this.expand) ? 'content active' : 'content';
    // this.transition = (this.transition) ? 'transition visible' : 'transition';
  }

  addLike(): void {
    this.es.addLike(this.verse._id, "mdarwish").subscribe(
      data => this.likeAdded(),
      error => this.updateFailed(error),
      () =>  this.logger.info("Request Completed")
    );
  }

  likeAdded(): void {
    if(this.liked) return;
    this.es.getLikesCount(this.verse._id, "mdarwish").subscribe(
      data => (data.count === 0 ) ? this.social_interactions.likes++ : this.social_interactions.likes = data.count + 1,
      error =>  this.logger.info("Error getting likes due to: " + error),
      () =>  this.logger.info("Request Completed")
    );

    const updateString: string = "ctx._source.social_agregates.likes = " + this.social_interactions.likes;
    const payload = {
      "script" : updateString
    };

    this.es.updateVerse(this.verse._id, payload).subscribe(
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
      this.es.addComment(this.verse._id, this.userComment).subscribe(
        data => this.commentAdded(),
        error => this.updateFailed(error),
        () =>  this.logger.info("Request Completed")
      );
    }
  }

  commentAdded(): void {
    this.userComment = "";
    this.es.getCommentsCount(this.verse._id).subscribe(
      data => (data.count === 0 ) ? this.social_interactions.comments++ : this.social_interactions.comments = data.count,
      error => this.logger.info("Error getting comments!"),
      () => [ this.logger.info("Request Completed"), this.userComment = ""]
    );

    const updateString = "ctx._source.social_agregates.comments = " + this.social_interactions.comments;
    this.logger.info("Update string: " + updateString);
    const payload: any = {
      "script": updateString
    };

    this.es.updateVerse(this.verse._id, payload).subscribe(
      data => this.getComments(),
      error => this.updateFailed(error),
      () =>  this.logger.info("Request Completed")
    );
  }

  toggleComments(): void {
    this.commentsExpanded = !this.commentsExpanded;
    this.getComments();
  }

  getComments(): void {
    this.es.getComments(this.verse._id).subscribe(
      data => this.refreshComments(data),
      error =>  this.logger.info("Error getting comments due to this error: \n" + error),
      () => [ this.logger.info("Request Completed"), this.userComment = ""]
    );

    this.es.getCommentsCount(this.verse._id).subscribe(
      data => this.social_interactions.comments = data.count,
      error => this.logger.info("Error getting comments count!"),
      () => [ this.logger.info("Request Completed"), this.userComment = ""]
    );
  }

  refreshComments(data: any) {
    this.commentsSource.next(data.hits.hits);
    this.social_interactions.comments = data.hits.total;
  }
}

