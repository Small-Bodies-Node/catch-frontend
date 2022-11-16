import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialModules } from './material-modules';
import { FontAwesomeIconsModule } from './font-awesome-icons.module';
import { SelectTableRowsDirective } from './directives/select-table-rows.directive';

@NgModule({
  declarations: [SelectTableRowsDirective],
  imports: [CommonModule, ...materialModules, FontAwesomeIconsModule],
  exports: [
    CommonModule,
    ...materialModules,
    FontAwesomeIconsModule,
    SelectTableRowsDirective,
  ],
})
export class SharedModule {}
