import { Category } from './category.model';

export interface Book {
  id: number;
  title: string;
  authors: string;
  publisher: string;
  isbn: string;
  created: Date;
  updated: Date;
  category: Category;
}

export interface AddBookModel {
  authors: string;
  categoryId: number;
  isbn: string;
  publisher: string;
  title: string;
}
