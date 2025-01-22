import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { IAppState } from '../../ngrx/reducers';

@Component({
  selector: 'app-moving-view',
  templateUrl: './moving-view.component.html',
  styleUrls: ['./moving-view.component.scss'],
  standalone: false,
})
export class MovingViewComponent implements OnInit {
  // --->>>

  subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<IAppState>
  ) {
    //--->>
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
