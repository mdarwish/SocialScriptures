import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AddressItem, PhoneNumberItem, User } from './user.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  colorTheme = 'theme-default';
  titleCollapse = 'title active';
  contentCollapse = 'content active';
  transition = 'transition';
  expand = true;

  constructor() { }

  ngOnInit() {
  }

  toggleExpand(): void {
    this.expand = !this.expand;
    this.titleCollapse = (this.expand) ? 'title active' : 'title';
    this.contentCollapse = (this.expand) ? 'content active' : 'content';
    this.transition = (this.transition) ? 'transition visible' : 'transition';
  }
}
