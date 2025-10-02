import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { NAVIGATION_MENU_ITEMS, IMenuItem } from '../../../utils/navigation-menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TPageLink } from '../../app-root/app.routes';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [
    CommonModule,
    //
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
})
export class SidenavComponent implements OnInit {
  // --->>>

  @Output()
  closeSidenav = new EventEmitter<void>();

  menuItems: IMenuItem[] = [];

  constructor(private delayedRouter: DelayedRouterService) {}

  ngOnInit() {
    this.menuItems = NAVIGATION_MENU_ITEMS;
  }

  _closeSidenav() {
    this.closeSidenav.emit();
  }

  _delayedRouting(link: TPageLink) {
    this.delayedRouter.delayedRouter(link);
  }
}
