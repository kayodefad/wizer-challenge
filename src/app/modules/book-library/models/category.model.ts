export interface GetCategoriesModel {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  users: Category[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created: Date;
  updated: Date;
}

export interface AddCategoryModel {
  description: string;
  name: string;
}
