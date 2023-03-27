import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  isSidebarOpen = new BehaviorSubject<boolean>(true);
  isSmallSidebarOpen = new BehaviorSubject<boolean>(false);

  constructor() {}
}
