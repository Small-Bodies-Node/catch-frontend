import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IObjectNameMatchResult } from '@client/app/models/object-name-match-result.model';

const ROOT_URL = 'https://musforti.astro.umd.edu/name-search/';

@Injectable({
  providedIn: 'root'
})
export class ObjectNameMatchService {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  constructor(private httpClient: HttpClient) {}

  objectNameMatch(userSubmittedText: string): Observable<IObjectNameMatchResult[]> {
    // -------------------------------------------------------------------------->>>

    const url = ROOT_URL + 'name?name=' + userSubmittedText;
    return this.httpClient.get<any>(url).pipe(
      map((data: { matches: IObjectNameMatchResult[]; name: string }) => {
        return data.matches;
      })
    );
  }
}
