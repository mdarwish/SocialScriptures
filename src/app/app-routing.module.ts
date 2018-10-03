import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { VerseComponent } from './verse/verse.component';
import { ChapterComponent } from './chapter/chapter.component';
import { BookComponent } from './book/book.component';
import { SearchComponent } from './search/search.component';
import { ContactComponent } from './contact/contact.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'verse', component: VerseComponent },
  { path: 'chapter', component: ChapterComponent },
  { path: 'search', component: SearchComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'book', component: BookComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
