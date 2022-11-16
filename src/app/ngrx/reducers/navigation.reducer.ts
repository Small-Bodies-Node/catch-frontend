import {
  NavigationActions,
  ENavigationActionTypes,
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

export function NavigationReducer(
  state = initialState,
  action: NavigationActions
): INavigationSubstate {
  // ---------------->>>

  switch (action.type) {
    case ENavigationActionTypes.NavigationSetIsNewRouteScheduled:
      return {
        ...state,
        ...action.payload,
      };

    case ENavigationActionTypes.NavigationSetRouteRecords:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
