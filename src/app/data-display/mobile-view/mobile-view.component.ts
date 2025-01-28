import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobile-view',
  templateUrl: './mobile-view.component.html',
  styleUrls: ['./mobile-view.component.scss'],
  standalone: false,
})
export class MobileViewComponent implements OnInit {
  // --->>>

  subscriptions = new Subscription();

  constructor() {
    // --->

    this.subscriptions.add();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
