import { createEffect, ofType, Actions } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';

import {
  ObjectNameMatchAction_FetchResults,
  ObjectNameMatchAction_SetResults,
} from '../actions/object-name-match.actions';
import { ObjectNameMatchService } from '../../core/services/object-name-match/object-name-match.service';

export const fetchObjectNameMatchResults$ = createEffect(
  (
    actions$ = inject(Actions),
    objectNameMatcher = inject(ObjectNameMatchService)
  ) => {
    return actions$.pipe(
      ofType(ObjectNameMatchAction_FetchResults),
      switchMap((action) => {
        const searchTerm = action.searchTerm;
        return objectNameMatcher
          .objectNameMatch(searchTerm)
          .pipe(
            map((results) => ObjectNameMatchAction_SetResults({ results }))
          );
      })
    );
  },
  { functional: true }
);
