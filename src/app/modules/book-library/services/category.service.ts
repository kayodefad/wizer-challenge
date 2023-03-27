import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AddCategoryModel,
  Category,
  GetCategoriesModel,
} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  activeCategory = new BehaviorSubject<Category | null>(null);
  
  constructor(private _http: HttpClient) {}

  getAllCategories(page: number, count: number) {
    return this._http.get<GetCategoriesModel>(
      `${environment.baseUrl}categories?count=${count}&page=${page}`
    );
  }

  addCategory(category: AddCategoryModel) {
    return this._http.post<Category>(
      `${environment.baseUrl}categories`,
      category
    );
  }

  editCategory(id: number, category: AddCategoryModel) {
    return this._http.put<Category>(
      `${environment.baseUrl}categories/${id}`,
      category
    );
  }

  deleteCategory(id: number) {
    return this._http.delete<null>(`${environment.baseUrl}categories/${id}`);
  }
}
