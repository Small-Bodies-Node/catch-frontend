import { createReducer, on } from '@ngrx/store';
import {
  TableDataCheckboxAction_SetState,
  TableFixedCheckboxAction_SetState,
} from '../actions/table-checkbox.actions';
import { TApiDataColState } from '../../../models/TApiDataColState';
import { apiDataInitColState } from '../../../utils/apiDataInitColState';
import { TApiFixedColState } from '../../../models/TApiFixedColState';
import { apiFixedInitColState } from '../../../utils/apiFixedInitColState';

export interface ITableCheckboxSubstate {
  tableDataCheckboxState: Partial<TApiDataColState>;
  tableFixedCheckboxState: Partial<TApiFixedColState>;
}

export const initialState: ITableCheckboxSubstate = {
  tableDataCheckboxState: { ...apiDataInitColState },
  tableFixedCheckboxState: { ...apiFixedInitColState },
};

export const tableCheckboxReducer = createReducer(
  initialState,
  on(
    TableDataCheckboxAction_SetState,
    (state, { newTableDataCheckboxState }) => ({
      ...state,
      tableDataCheckboxState: { ...newTableDataCheckboxState },
    })
  ),
  on(
    TableFixedCheckboxAction_SetState,
    (state, { newTableFixedCheckboxState }) => ({
      ...state,
      tableFixedCheckboxState: { ...newTableFixedCheckboxState },
    })
  )
);
