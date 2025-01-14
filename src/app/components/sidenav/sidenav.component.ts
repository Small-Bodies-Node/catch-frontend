import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    //
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    FontAwesomeModule,
  ],
})
export class SidenavComponent implements OnInit {
  // --->>>

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
