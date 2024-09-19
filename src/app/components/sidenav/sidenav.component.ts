import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DelayedRouterService } from '../../core/services/delayed-router/delayed-router.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
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
