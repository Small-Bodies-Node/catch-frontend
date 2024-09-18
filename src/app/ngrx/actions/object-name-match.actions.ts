import { createAction, props } from '@ngrx/store';
import { IObjectNameMatchResult } from '../../models/IObjectNameMatchResult';

export const ObjectNameMatchAction_FetchResults = createAction(
  'Object Name Match Action: Fetch Results',
  props<{ searchTerm: string }>()
);

export const ObjectNameMatchAction_SetResults = createAction(
  'Object Name Match Action: Set Results',
  props<{ results: IObjectNameMatchResult[] }>()
);

export const ObjectNameMatchAction_SetIsSearching = createAction(
  'Object Name Match Action: Set IsSearching',
  props<{ isSearching: boolean }>()
);

export const ObjectNameMatchAction_ResultsLoaded = createAction(
  'Object Name Match Action: Results Loaded'
);
