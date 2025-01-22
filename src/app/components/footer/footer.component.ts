import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IAppState } from '../../ngrx/reducers';
import { SiteSettingsAction_SetIsHappyWithCookies } from '../../ngrx/actions/site-settings.actions';
import { selectSiteSettingsIsHappyWithCookies } from '../../ngrx/selectors/site-settings.selectors';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule, MatToolbarModule, MatIconModule],
})
export class FooterComponent {
  // --->>>

  lastUpdated = '';

  timeStamp = ' ' + new Date().getFullYear();

  sbnLogo = 'assets/images/pngs/sbn_logo_v1.png';

  isHappyWithCookie$: Observable<boolean>;

  constructor(private store$: Store<IAppState>) {
    // witch off for now
    this.store$.dispatch(
      SiteSettingsAction_SetIsHappyWithCookies({ isHappyWithCookies: true })
    );

    this.isHappyWithCookie$ = this.store$.select(
      selectSiteSettingsIsHappyWithCookies
    );

    this.isHappyWithCookie$.subscribe((val) => {
      console.log('Is happy with cookies:', val);
    });
  }

  acceptTerms() {
    this.store$.dispatch(
      SiteSettingsAction_SetIsHappyWithCookies({ isHappyWithCookies: true })
    );
  }
}
