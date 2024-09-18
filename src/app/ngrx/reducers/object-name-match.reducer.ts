import { createReducer, on } from '@ngrx/store';
import {
  ObjectNameMatchAction_SetResults,
  ObjectNameMatchAction_SetIsSearching,
} from '../actions/object-name-match.actions';
import { IObjectNameMatchResult } from '../../models/IObjectNameMatchResult';

export interface IObjectNameMatchSubstate {
  results: IObjectNameMatchResult[];
  isSearching: boolean;
}

export const initialState: IObjectNameMatchSubstate = {
  results: [],
  isSearching: false,
};

export const objectNameMatchReducer = createReducer(
  initialState,
  on(ObjectNameMatchAction_SetResults, (state, { results }) => ({
    ...state,
    results: [...results],
  })),
  on(ObjectNameMatchAction_SetIsSearching, (state, { isSearching }) => ({
    ...state,
    isSearching,
  }))
);
