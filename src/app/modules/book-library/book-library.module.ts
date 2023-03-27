import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookLibraryComponent } from './book-library.component';
import { ROUTES } from './book-library.routes';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BooksComponent } from './components/books/books.component';

@NgModule({
  declarations: [BookLibraryComponent, HeaderComponent, MainComponent, CategoriesComponent, BooksComponent],
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
})
export class BookLibraryModule {}
