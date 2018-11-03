import { Component, OnInit, Input } from '@angular/core';
import {TransitionController, Transition, TransitionDirection} from "ng2-semantic-ui";
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() comments: any;

    
  titleCollapse = 'title active';
  contentCollapse = 'content active';
  transition = 'transition';
  expand = false;

  public transitionController;
  public animate(transitionName:string = "browse") {
    this.transitionController.animate(
        new Transition(transitionName, 600, TransitionDirection.In, () => console.log("Completed transition.")));
 }

  constructor() { 
    this.transitionController = new TransitionController(false, "block");
  }
// .subscribe(newComments => this.comments = newComments);
  ngOnInit() {
    //this.expand = false;
    //this.commentsObservable.subscribe(newComments => this.comments = newComments);
    this.toggleExpand();
  }

  toggleExpand(): void {
    this.expand = !this.expand;
    if(this.expand) this.animate();
    this.titleCollapse = (this.expand) ? 'title active ' : 'title ';
    this.contentCollapse = (this.expand) ? 'content active ' : 'content ';
    //this.transition = (this.expand) ? 'transition visible' : 'transition';
  }
}
