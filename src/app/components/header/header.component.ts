import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DelayedRouterService } from 'src/app/core/services/delayed-router/delayed-router.service';
import { headerHeightPx } from 'src/app/utils/layout-constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // --->>>

  @Output()
  openSidenav: EventEmitter<any> = new EventEmitter();

  constructor(private delayedRouter: DelayedRouterService) {}

  ngOnInit() {}

  _openSidenav() {
    this.openSidenav.emit();
  }

  delayedRouting(link: string) {
    this.delayedRouter.delayedRouter(link);
  }

  getMatToolbarStyles() {
    return { height: `${headerHeightPx}px` };
  }
}
