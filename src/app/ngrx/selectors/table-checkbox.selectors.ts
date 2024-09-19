import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { ITableCheckboxSubstate } from '../reducers/table-checkbox.reducer';

/**
 *
 * Elemental TableCheckbox Selectors
 *
 */

export const selectTableCheckboxState = createSelector(
  (state: IAppState) => state.tableCheckbox,
  (substate: ITableCheckboxSubstate) => {
    console.log('Date 1', new Date());
    return substate.tableCheckboxState;
  }
);
