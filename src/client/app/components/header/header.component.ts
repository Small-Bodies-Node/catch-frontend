import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DelayedRouterService } from '@client/app/core/services/delayed-router/delayed-router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  @Output()
  openSidenav: EventEmitter<any> = new EventEmitter();

  catchLogo = '../../../assets/images/pngs/large_logo_v4.png';

  constructor(private delayedRouter: DelayedRouterService) {}

  ngOnInit() {}

  _openSidenav() {
    this.openSidenav.emit();
  }

  _delayedRouting(link: string) {
    this.delayedRouter.delayedRouter(link);
  }
}
