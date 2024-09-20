import { createReducer, on } from '@ngrx/store';
import { TableCheckboxAction_SetState } from '../actions/table-checkbox.actions';
import { TApiDataColState } from '../../../models/TApiDataColState';
import { apiDataInitColState } from '../../../utils/apiDataInitColState';

export interface ITableCheckboxSubstate {
  tableCheckboxState: Partial<TApiDataColState>;
}

export const initialState: ITableCheckboxSubstate = {
  tableCheckboxState: { ...apiDataInitColState },
};

export const tableCheckboxReducer = createReducer(
  initialState,
  on(TableCheckboxAction_SetState, (state, { newTableCheckboxState }) => ({
    ...state,
    tableCheckboxState: { ...newTableCheckboxState },
  }))
);
