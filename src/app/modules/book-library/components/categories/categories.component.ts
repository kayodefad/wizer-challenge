import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ConfirmDeleteDialogComponent } from 'src/app/modules/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @ViewChild('addEditCategory', { static: true })
  addEditCategory!: TemplateRef<any>;
  activeCategory!: Category | null;

  private dialogRef!: MatDialogRef<any>;

  categories: Category[] = [];
  page = 1;
  count = 0;
  limit = 5;
  loading = true;

  subscriptions: Subscription[] = [];

  categoryForm!: FormGroup;

  constructor(
    private dialog: MatDialog,
    private _fb: FormBuilder,
    public _categoryService: CategoryService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.fetchCategories();
    this.getActiveCategory();
  }

  buildForm() {
    this.categoryForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  getActiveCategory() {
    const subscription = this._categoryService.activeCategory.subscribe({
      next: (res) => {
        this.activeCategory = res;
      },
    });
    this.subscriptions.push(subscription);
  }

  fetchCategories() {
    this.loading = true;
    const subscription = this._categoryService
      .getAllCategories(this.page - 1, this.limit)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.count = res.totalItems;
          this.categories = res.users;
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Err:', err);
        },
      });

    this.subscriptions.push(subscription);
  }

  onDataChange(event: number) {
    this.page = event;
    this.fetchCategories();
  }

  openCategoryDialog(category?: Category) {
    if (category) {
      this.categoryForm.setValue({
        name: category.name,
        description: category.description,
      });
    } else {
      this.categoryForm.reset();
    }
    this.dialogRef = this.dialog.open(this.addEditCategory, {
      width: '95%',
      maxWidth: '600px',
      data: category,
    });
    this.dialogRef.afterClosed().subscribe(() => {});
  }

  onSubmit(id: number) {
    this.loading = true;
    const subscription = id ? this.editCategory(id) : this.addCategory();
    this.subscriptions.push(subscription);
  }

  addCategory() {
    return this._categoryService
      .addCategory({
        ...this.categoryForm.value,
      })
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.loading = false;
          this._snackBar.open('Category added!', 'close', {
            duration: 3000,
          });
          // Check if length of list equals limit
          if (this.categories.length === this.limit) {
            this.page = this.page + 1;
          }
          this.fetchCategories();
        },
        error: (err) => {
          this.errorAction(err);
        },
      });
  }

  editCategory(id: number) {
    return this._categoryService
      .editCategory(id, {
        ...this.categoryForm.value,
      })
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.loading = false;
          this._snackBar.open('Category edited!', 'close', {
            duration: 3000,
          });
          this.categories = this.categories.map((category) => {
            if (category.id === id) {
              category = res;
            }
            return category;
          });
        },
        error: (err) => {
          this.errorAction(err);
        },
      });
  }

  openDeleteDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subscription = this._categoryService
          .deleteCategory(id)
          .subscribe({
            next: (res) => {
              console.log({ res });
            },
            error: (err: HttpErrorResponse) => {
              // console.log({ err: err.status });
              if (err.status === 200) {
                this._snackBar.open('Category deleted!', 'close', {
                  duration: 3000,
                });
                // Check if length of list equals 1
                if (this.categories.length === 1) {
                  this.page = this.page - 1;
                }
                this.fetchCategories();

                // Reset active category after delete
                if (this.activeCategory?.id === id) {
                  this._categoryService.activeCategory.next(null);
                }
              } else {
                this.errorAction(err);
              }
            },
          });
        this.subscriptions.push(subscription);
      }
    });
  }

  errorAction(error: any) {
    this.loading = false;
    console.error('An error occurred', error);
    this._snackBar.open(error.error.message || 'An error occurred', 'close', {
      duration: 3000,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
