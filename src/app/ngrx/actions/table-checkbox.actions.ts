import { Action } from '@ngrx/store';

import { TApiDataColState } from 'src/app/models/TApiDataColState';

export enum ETableCheckboxActionTypes {
  SetTableCheckboxState = '[TableCheckbox] Set Table Checkbox State',
}

export class TableCheckboxSetState implements Action {
  readonly type = ETableCheckboxActionTypes.SetTableCheckboxState;
  constructor(
    public payload: { newTableCheckboxState: Partial<TApiDataColState> }
  ) {}
}

export type TableCheckboxActions = TableCheckboxSetState;
