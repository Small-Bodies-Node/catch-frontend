import { createEffect, ofType, Actions } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';

import {
  ObjectNameMatchAction_FetchResults,
  ObjectNameMatchAction_SetResults,
} from '../actions/object-name-match.actions';
import { ObjectNameMatchService } from '../../core/services/object-name-match/object-name-match.service';
import { environment } from '../../../environments/environment';
import { ObjectNameMatchMockService } from '../../core/services/object-name-match/object-name-match-mock.service';

// export const isMockDataUsed = !false && environment.apiData === 'mock';

export const fetchObjectNameMatchResults$ = createEffect(
  (
    actions$ = inject(Actions),
    objectNameMatcher = environment.apiData === 'mock'
      ? inject(ObjectNameMatchMockService)
      : inject(ObjectNameMatchService)
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
  { functional: true, dispatch: true }
);
