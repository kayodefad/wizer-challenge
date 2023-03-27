import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  viewportWidth: number;
  isLargeViewport: boolean;
  isSmallSidebarOpen!: boolean;
  @ViewChild('sidebarModal', { static: true })
  sidebarModal!: TemplateRef<any>;
  subscriptions: Subscription[] = [];

  constructor(public uiService: UiService, private dialog: MatDialog) {
    this.viewportWidth = window.innerWidth;
    this.isLargeViewport = this.viewportWidth > 576;
  }

  ngOnInit(): void {
    this.setIsSmallSidebarOpen();
  }

  setIsSmallSidebarOpen() {
    const subscription = this.uiService.isSmallSidebarOpen.subscribe({
      next: (result) => {
        if (result) {
          this.openSidebarModal();
        }
      },
      error: (err) => {
        console.error('Error', err);
      },
    });

    this.subscriptions.push(subscription);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.viewportWidth = event.target.innerWidth;
    this.isLargeViewport = this.viewportWidth > 576;
  }

  openSidebarModal() {
    let dialogConfig = new MatDialogConfig();

    dialogConfig = {
      panelClass: ['slide-in-left'],
      position: {
        left: '0px',
        top: '0px',
      },
      width: '290px',
      height: '100%',
      autoFocus: false,
    };

    this.dialog
      .open(this.sidebarModal, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.uiService.isSmallSidebarOpen.next(false);
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
