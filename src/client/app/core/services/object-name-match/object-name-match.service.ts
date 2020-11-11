import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IObjectNameMatchResult } from '@client/app/models/object-name-match-result.model';
// import { ROOT_URL } from '@client/app/utils/root-url';
import { map } from 'rxjs/operators';

// const ROOT_URL = 'https://musforti.astro.umd.edu/catch-sandbox/';
// const ROOT_URL = 'https://catch.astro.umd.edu/catch-sandbox/';
// const ROOT_URL = 'https://catch.astro.umd.edu/catch-stage/';
const ROOT_URL = 'https://musforti.astro.umd.edu/name-search/';
// const ROOT_URL = 'http://localhost:5004/';

@Injectable({
  providedIn: 'root'
})
export class ObjectNameMatchService {
  constructor(private httpClient: HttpClient) {}

  objectNameMatch(userSubmittedText: string): Observable<IObjectNameMatchResult[]> {
    // const url = ROOT_URL + 'query/name?name=' + userSubmittedText;
    const url = ROOT_URL + 'name?name=' + userSubmittedText;
    return this.httpClient.get<any>(url).pipe(
      map((data: { matches: IObjectNameMatchResult[]; name: string }) => {
        return data.matches;
      })
    );
  }
}
