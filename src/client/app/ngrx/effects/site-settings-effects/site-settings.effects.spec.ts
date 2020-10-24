import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { initialState as siteSettingsInitialState } from '../../reducers/site-settings-reducer/site-settings.reducer';
import { SiteSettingsEffects } from './site-settings.effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';

describe('SiteSettingsEffects', () => {
  let actions$: Observable<any>;
  let effects: SiteSettingsEffects;

  let store: MockStore<AppState>;
  const initialState: Partial<AppState> = {
    siteSettingsSubstate: siteSettingsInitialState
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SiteSettingsEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState })
      ]
    });
    // @ts-ignore:
    effects = TestBed.inject<SiteSettingsEffects>(SiteSettingsEffects);
    // @ts-ignore:
    store = TestBed.inject<Store<any>>(Store);
  });

  it('should be created ', () => {
    expect(effects).toBeTruthy();
  });
});
