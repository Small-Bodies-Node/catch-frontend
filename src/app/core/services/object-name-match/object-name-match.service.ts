import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IObjectNameMatchResult } from '../../../../models/IObjectNameMatchResult';

type TOONMR = Observable<IObjectNameMatchResult[]>;

const ROOT_URL = 'https://name-resolution.astro-prod-it.aws.umd.edu/';

@Injectable({
  providedIn: 'root',
})
export class ObjectNameMatchService {
  // --->>

  constructor(private httpClient: HttpClient) {}

  objectNameMatch(userSubmittedText: string): TOONMR {
    // --->>

    const params = new URLSearchParams({ name: userSubmittedText });
    const url = `${ROOT_URL}name?${params.toString()}`;
    return this.httpClient.get<any>(url).pipe(
      map((data: { matches: IObjectNameMatchResult[]; name: string }) => {
        return data.matches;
      })
    );
  }
}
