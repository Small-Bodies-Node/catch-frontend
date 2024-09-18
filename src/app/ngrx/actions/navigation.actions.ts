import { createAction, props } from '@ngrx/store';

export const NavigationAction_SetIsNewRouteScheduled = createAction(
  'Navigation Action: Set Is New Route Scheduled',
  props<{ isNewRouteScheduled: boolean }>()
);

export const NavigationAction_SetRouteRecords = createAction(
  'Navigation Action: Set Route Records',
  props<{
    previousRoute?: string;
    presentRoute?: string;
    isNewRouteScheduled: boolean;
  }>()
);

export const NavigationAction_UpdateRouteRecords = createAction(
  'Navigation Action: Update Route Records',
  props<{ newPresentRoute: string }>()
);
