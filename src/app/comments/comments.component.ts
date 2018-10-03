import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  commentsObservable: any;
  @Input() comments: any;

  titleCollapse = 'title active';
  contentCollapse = 'content active';
  transition = 'transition';
  expand = true;

  constructor() { }

  ngOnInit() {
    this.expand = true;
  }

  toggleExpand(): void {
    this.expand = !this.expand;
    this.titleCollapse = (this.expand) ? 'title active transition' : 'title transition';
    this.contentCollapse = (this.expand) ? 'content active transition' : 'content transition';
    this.transition = (this.transition) ? 'transition visible' : 'transition';
  }
}
