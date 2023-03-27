import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddBookModel, Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private _http: HttpClient) {}

  getBooksByCategory(categoryId: number) {
    return this._http.get<Book[]>(
      `${environment.baseUrl}books/by-category/${categoryId}`
    );
  }

  addNewBook(book: AddBookModel) {
    return this._http.post<Book>(`${environment.baseUrl}books`, book);
  }

  editBook(id: number, book: AddBookModel) {
    return this._http.put<Book>(`${environment.baseUrl}books/${id}`, book);
  }

  deleteBook(id: number) {
    return this._http.delete<null>(`${environment.baseUrl}books/${id}`);
  }
}
