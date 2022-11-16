import { apiDataInitColState } from 'src/app/utils/apiDataInitColState';
import { TApiDataColState } from 'src/app/models/TApiDataColState';
import {
  ETableCheckboxActionTypes,
  TableCheckboxActions,
} from '../actions/table-checkbox.actions';

export interface ITableCheckboxSubstate {
  tableCheckboxState: Partial<TApiDataColState>;
}

export const initialState: ITableCheckboxSubstate = {
  tableCheckboxState: { ...apiDataInitColState },
};

export function tableCheckboxReducer(
  state = initialState,
  action: TableCheckboxActions
): ITableCheckboxSubstate {
  // --->>

  switch (action.type) {
    case ETableCheckboxActionTypes.SetTableCheckboxState:
      return {
        ...state,
        tableCheckboxState: { ...action.payload.newTableCheckboxState },
      };

    default:
      return state;
  }
}
