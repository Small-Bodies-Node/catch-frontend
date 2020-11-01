import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DelayedRouterService } from '@client/app/core/services/delayed-router/delayed-router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SidenavComponent implements OnInit {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  @Output()
  closeSidenav = new EventEmitter<void>();

  constructor(private delayedRouter: DelayedRouterService) {}

  ngOnInit() {}

  _closeSidenav() {
    this.closeSidenav.emit();
  }

  _delayedRouting(link: string) {
    this.delayedRouter.delayedRouter(link);
  }
}
