import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
