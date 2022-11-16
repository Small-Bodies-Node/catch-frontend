import { Action } from '@ngrx/store';

export enum ENavigationActionTypes {
  NavigationSetIsNewRouteScheduled = '[Navigation] Set Is Scheduled',
  NavigationSetRouteRecords = '[Navigation] Set Route Records',
  NavigationUpdateRouteRecords = '[Navigation] Update Route Records',
}

export class NavigationSetIsNewRouteScheduled implements Action {
  readonly type = ENavigationActionTypes.NavigationSetIsNewRouteScheduled;
  constructor(public payload: { isNewRouteScheduled: boolean }) {}
}

export class NavigationSetRouteRecords implements Action {
  readonly type = ENavigationActionTypes.NavigationSetRouteRecords;
  constructor(
    public payload: {
      previousRoute?: string;
      presentRoute?: string;
      isNewRouteScheduled: false;
    }
  ) {}
}

export class NavigationUpdateRouteRecords implements Action {
  readonly type = ENavigationActionTypes.NavigationUpdateRouteRecords;
  constructor(public payload: { newPresentRoute: string }) {}
}

export type NavigationActions =
  | NavigationSetIsNewRouteScheduled
  | NavigationSetRouteRecords
  | NavigationUpdateRouteRecords;
