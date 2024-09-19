import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';
import { headerHeightPx } from '../../../utils/layout-constants';

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
