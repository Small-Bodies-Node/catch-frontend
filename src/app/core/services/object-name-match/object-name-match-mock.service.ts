import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { IObjectNameMatchResult } from '../../../models/IObjectNameMatchResult';

@Injectable({
  providedIn: 'root',
})
export class ObjectNameMatchMockService {
  // --->>>

  constructor() {}

  objectNameMatch(): Observable<IObjectNameMatchResult[]> {
    return of([
      {
        body_type: 'comet',
        comparison_text: '',
        display_text: '65P / Gunn',
        target: '65P',
      },
    ]);
  }
}
