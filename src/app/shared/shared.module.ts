import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialModules } from './material-modules';
import { SelectTableRowsDirective } from './directives/select-table-rows.directive';

@NgModule({
  declarations: [SelectTableRowsDirective],
  imports: [
    //
    CommonModule,
    ...materialModules,
  ],
  exports: [CommonModule, ...materialModules, SelectTableRowsDirective],
})
export class SharedModule {}
