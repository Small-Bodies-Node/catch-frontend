import { Directive, ElementRef } from '@angular/core';

/**
 * If you want to get a handle on an HTML element
 * (e.g. <tr></tr> generated by NgMaterial)
 * using @ViewChildren, then you can't directly
 * use e.g. @ViewChildren('tr'). ViewChildren will
 * only accept:
 * - Classes (viz. @Component or @Directive)
 * - String that corresponds with customized token in HTML template
 * (e.g. #mydiv -> @ViewChildren('mydiv'))
 * We cannot put a custom token on tr elements generated by NgMaterial
 * so we have to create a directive that does query-selection
 */

// @Directive({ selector: 'table > tbody > tr' })
@Directive({
    selector: 'table tbody tr',
    standalone: false
})
export class SelectTableRowsDirective {
  // --->>>

  nativeElement: HTMLTableCellElement;
  constructor(el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }
}
