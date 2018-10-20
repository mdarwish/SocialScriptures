import { Component, OnInit, Input } from '@angular/core';
import {TransitionController, Transition, TransitionDirection} from "ng2-semantic-ui";


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment: any;
  titleCollapse = 'title active';
  contentCollapse = 'content active';
  transition = 'transition';
  expand = true;
  public transitionController;

  constructor() { 
    this.transitionController = new TransitionController(false, "block");
  }

  ngOnInit() {
    this.animate();
  }

  public animate(transitionName:string = "browse") {
    this.transitionController.animate(
        new Transition(transitionName, 300, TransitionDirection.In, () => console.log("Completed transition.")));
 }
}
