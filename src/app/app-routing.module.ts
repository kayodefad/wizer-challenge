import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'book-library',
        loadChildren: () =>
          import('./modules/book-library/book-library.module').then(
            (m) => m.BookLibraryModule
          ),
      },
      {
        path: '',
        redirectTo: '/book-library',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
