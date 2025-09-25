import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { headerHeightPx } from '../../../utils/constants';
import { TPageLink } from '../../app-root/app.routes';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    //
    CommonModule,
    MatToolbar,
    MatIcon,
    MatRipple,
    MatIconButton,
  ],
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

  delayedRouting(link: TPageLink) {
    this.delayedRouter.delayedRouter(link);
  }

  getMatToolbarStyles() {
    return { height: `${headerHeightPx}px` };
  }
}
