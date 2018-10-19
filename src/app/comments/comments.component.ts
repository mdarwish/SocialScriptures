import { Component, OnInit, Input } from '@angular/core';
import {TransitionController, Transition, TransitionDirection} from "ng2-semantic-ui";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() commentsObservable: any;
  @Input() comments: any;

  public transitionController;
    
  titleCollapse = 'title active';
  contentCollapse = 'content active';
  transition = 'transition';
  expand = false;

  constructor() { 
    this.transitionController = new TransitionController(false, "block");
  }

  ngOnInit() {
    //this.expand = false;
    this.toggleExpand();
  }

  public animate(transitionName:string = "fly left") {
    this.transitionController.animate(
        new Transition(transitionName, 300, TransitionDirection.In, () => console.log("Completed transition.")));
 }

  toggleExpand(): void {
    this.expand = !this.expand;
    if(this.expand) this.animate();
    this.titleCollapse = (this.expand) ? 'title active ' : 'title ';
    this.contentCollapse = (this.expand) ? 'content active ' : 'content ';
    //this.transition = (this.expand) ? 'transition visible' : 'transition';
  }
}
