import { Action } from '@ngrx/store';

export enum ENavigationActionTypes {
  NavigationSetIsNewRouteScheduled = '[Navigation] Set Is Scheduled',
  NavigationSetRouteRecords = '[Navigation] Set Route Records',
  NavigationCollectRouteRecords = '[Navigation] Collect Route Records'
}

export class NavigationSetIsNewRouteScheduled implements Action {
  readonly type = ENavigationActionTypes.NavigationSetIsNewRouteScheduled;
  constructor(public payload: { isNewRouteScheduled: boolean }) {}
}

export class NavigationSetRouteRecords implements Action {
  readonly type = ENavigationActionTypes.NavigationSetRouteRecords;
  constructor(
    public payload: { previousRoute?: string; presentRoute?: string; isNewRouteScheduled: false }
  ) {}
}

export class NavigationCollectRouteRecords implements Action {
  readonly type = ENavigationActionTypes.NavigationCollectRouteRecords;
  constructor(public payload: { newPresentRoute: string }) {}
}

export type NavigationActions =
  | NavigationSetIsNewRouteScheduled
  | NavigationSetRouteRecords
  | NavigationCollectRouteRecords;
