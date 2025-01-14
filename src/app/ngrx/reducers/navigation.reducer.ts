import { createReducer, on } from '@ngrx/store';
import {
  NavigationAction_SetIsNewRouteScheduled,
  NavigationAction_SetRouteRecords,
} from '../actions/navigation.actions';

export interface INavigationSubstate {
  isNewRouteScheduled: boolean;
  previousRoute?: string;
  presentRoute?: string;
}

export const initialState: INavigationSubstate = {
  isNewRouteScheduled: false,
  previousRoute: undefined,
  presentRoute: undefined,
};

export const navigationReducer = createReducer(
  initialState,
  on(NavigationAction_SetIsNewRouteScheduled, (state, payload) => ({
    ...state,
    ...payload,
  })),
  on(NavigationAction_SetRouteRecords, (state, payload) => ({
    ...state,
    ...payload,
  }))
);
