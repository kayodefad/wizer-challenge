import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  subscriptions: Subscription[] = [];
  viewportWidth: number;

  constructor(public uiService: UiService) {
    this.viewportWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.viewportWidth = event.target.innerWidth;
  }

  toggleMainSidebarOpen() {
    this.uiService.isSidebarOpen.next(!this.uiService.isSidebarOpen.value);
  }

  toggleSmallSidebarOpen() {
    this.uiService.isSmallSidebarOpen.next(
      !this.uiService.isSmallSidebarOpen.value
    );
  }
}
