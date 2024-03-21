import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/ngrx/reducers';
import { selectSiteSettingsIsHappyWithCookies } from 'src/app/ngrx/selectors/site-settings.selectors';
import { SiteSettingsSetIsHappyWithCookies } from 'src/app/ngrx/actions/site-settings.actions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
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
      new SiteSettingsSetIsHappyWithCookies({ isHappyWithCookies: true })
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
      new SiteSettingsSetIsHappyWithCookies({ isHappyWithCookies: true })
    );
  }
}
