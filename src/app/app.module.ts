import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AlertModule } from '../../node_modules/ngx-bootstrap';

import { AppComponent } from './app.component';
import { EsearchService } from './esearch.service';
import { SharedService } from './shared.service';
import { HomeComponent } from './home/home.component';
import { VerseComponent } from './verse/verse.component';
import { ChapterComponent } from './chapter/chapter.component';
import { BookComponent } from './book/book.component';
import { SearchComponent } from './search/search.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ContactComponent } from './contact/contact.component';
import { SignupComponent } from './signup/signup.component';
import { BsDatepickerModule, BsDropdownModule } from 'ngx-bootstrap';
import { CommentsComponent } from './comments/comments.component';
import { CommentComponent } from './comment/comment.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VerseComponent,
    ChapterComponent,
    BookComponent,
    SearchComponent,
    NavigationComponent,
    ContactComponent,
    SignupComponent,
    CommentsComponent,
    CommentComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule,
    AlertModule,
    NgLoggerModule.forRoot(Level.LOG)
  ],
  providers: [EsearchService, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
