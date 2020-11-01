import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { selectSiteSettingsIsHappyWithCookies } from '../../ngrx/selectors/site-settings.selectors';
import { SiteSettingsSetIsHappyWithCookies } from '../../ngrx/actions/site-settings.actions';
import { AppState } from '@client/app/ngrx/reducers';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  lastUpdated = '';

  timeStamp = ' ' + new Date().getFullYear();

  sbnLogo = 'assets/images/pngs/sbn_logo5_v0.png';

  isHappyWithCookie$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.isHappyWithCookie$ = this.store.select(selectSiteSettingsIsHappyWithCookies);
  }

  ngOnInit() {}

  acceptTerms() {
    this.store.dispatch(new SiteSettingsSetIsHappyWithCookies({ isHappyWithCookies: true }));
  }
}
