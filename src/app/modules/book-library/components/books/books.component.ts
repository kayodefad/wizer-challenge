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
import { Book } from '../../models/book.model';
import { Category } from '../../models/category.model';
import { BookService } from '../../services/book.service';
import { CategoryService } from '../../services/category.service';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit, OnDestroy {
  @ViewChild('addEditBook', { static: true })
  addEditBook!: TemplateRef<any>;
  activeCategory!: Category | null;
  numberOfCategories!: number;

  private dialogRef!: MatDialogRef<any>;

  books: Book[] = [];
  loading = false;

  subscriptions: Subscription[] = [];

  bookForm!: FormGroup;

  constructor(
    public dialog: MatDialog,
    private _fb: FormBuilder,
    private _bookService: BookService,
    private _categoryService: CategoryService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getActiveCategory();
  }

  buildForm() {
    this.bookForm = this._fb.group({
      authors: ['', Validators.required],
      isbn: ['', Validators.required],
      publisher: ['', Validators.required],
      title: ['', Validators.required],
    });
  }

  getActiveCategory() {
    const subscription = this._categoryService.activeCategory.subscribe({
      next: (res) => {
        if (res) {
          this.activeCategory = res;
          this.fetchBooksByCategory(res.id);
        } else {
          this.activeCategory = null;
          this.books = [];
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  openBookDialog(book?: Book, edit = false) {
    if (book) {
      this.bookForm.setValue({
        authors: book?.authors,
        isbn: book?.isbn,
        publisher: book?.publisher,
        title: book?.title,
      });
    } else {
      this.bookForm.reset();
    }
    this.dialogRef = this.dialog.open(this.addEditBook, {
      width: '95%',
      maxWidth: '600px',
      data: book,
    });
    this.dialogRef.afterClosed().subscribe(() => {});
  }

  onSubmit(id: number) {
    this.loading = true;
    const subscription = id ? this.editBook(id) : this.addBook();
    this.subscriptions.push(subscription);
  }

  addBook() {
    return this._bookService
      .addNewBook({
        ...this.bookForm.value,
        categoryId: this.activeCategory?.id,
      })
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.loading = false;
          this._snackBar.open('Book added!', 'close', {
            duration: 3000,
          });
          this.books.push(res);
        },
        error: (err) => {
          this.errorAction(err);
        },
      });
  }

  editBook(id: number) {
    return this._bookService
      .editBook(id, {
        ...this.bookForm.value,
        categoryId: this.activeCategory?.id,
      })
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.loading = false;
          this._snackBar.open('Book edited!', 'close', {
            duration: 3000,
          });
          this.books = this.books.map((book) => {
            if (book.id === id) {
              book = res;
            }
            return book;
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
        const subscription = this._bookService.deleteBook(id).subscribe({
          next: (res) => {},
          error: (err) => {
            if (err.status === 200) {
              this._snackBar.open('Book deleted!', 'close', {
                duration: 3000,
              });
              this.books = this.books.filter((book) => book.id !== id);
            }
          },
        });
        this.subscriptions.push(subscription);
      }
    });
  }

  fetchBooksByCategory(id: number) {
    this.loading = true;
    const subscription = this._bookService.getBooksByCategory(id).subscribe({
      next: (res) => {
        this.loading = false;
        this.books = res;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Err:', err);
      },
    });
    this.subscriptions.push(subscription);
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
