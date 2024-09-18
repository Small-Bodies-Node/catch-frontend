import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  EObjectNameMatchActionTypes,
  ObjectNameMatchActions,
  ObjectAction_NameMatchFetchResults,
  ObjectNameMatchSetResults,
} from '../actions/object-name-match.actions';
import { ObjectNameMatchService } from 'src/app/core/services/object-name-match/object-name-match.service';

@Injectable()
export class ObjectNameMatchEffects {
  constructor(
    private actions$: Actions<ObjectNameMatchFetchResults>,
    private objectNameMatcher: ObjectNameMatchService
  ) {}

  fetchObjectNameMatchResults$: Observable<ObjectNameMatchActions> =
    createEffect(() => {
      return this.actions$.pipe(
        ofType(EObjectNameMatchActionTypes.ObjectNameMatchFetchResults),
        map((_) => {
          // console.log('_', _);
          return _;
        }),
        // switchMap will flatten nested observable and cancel all but the most recently received observable
        switchMap((action) => {
          const searchTerm = action.payload.searchTerm;
          return this.objectNameMatcher.objectNameMatch(searchTerm).pipe(
            map((results) => {
              return new ObjectNameMatchSetResults({ results });
            })
          );
        })
      );
    });
}
