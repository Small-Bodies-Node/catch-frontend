import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { ITableCheckboxSubstate } from '../reducers/table-checkbox.reducer';

/**
 *
 * Elemental TableCheckbox Selectors
 *
 */

export const selectTableDataCheckboxState = createSelector(
  (state: IAppState) => state.tableCheckbox,
  (substate: ITableCheckboxSubstate) => {
    return substate.tableDataCheckboxState;
  }
);

export const selectTableFixedCheckboxState = createSelector(
  (state: IAppState) => state.tableCheckbox,
  (substate: ITableCheckboxSubstate) => {
    return substate.tableFixedCheckboxState;
  }
);
