import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineInterceptor } from './interceptors/http-pipeline.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    /* [CORE, DECLARATIONS] != 0 */
  ],
  imports: [CommonModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: PipelineInterceptor, multi: true },
  ],
})
export class CoreModule {}
