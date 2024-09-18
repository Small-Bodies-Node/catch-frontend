import { createAction, props } from '@ngrx/store';
import { TApiDataColState } from '../../models/TApiDataColState';

export const TableCheckboxAction_SetState = createAction(
  'Table Checkbox Action: Set Table Checkbox State',
  props<{ newTableCheckboxState: Partial<TApiDataColState> }>()
);
