import { createAction, props } from '@ngrx/store';
import { TApiDataColState } from '../../../models/TApiDataColState';
import { TApiFixedColState } from '../../../models/TApiFixedColState';

export const TableDataCheckboxAction_SetState = createAction(
  'Table Data Checkbox Action: Set Table Checkbox State For Moving Object',
  props<{
    newTableDataCheckboxState: Partial<TApiDataColState>;
  }>()
);

export const TableFixedCheckboxAction_SetState = createAction(
  'Table Fixed Checkbox Action: Set Table Checkbox State For Fixed Object',
  props<{
    newTableFixedCheckboxState: Partial<TApiFixedColState>;
  }>()
);
