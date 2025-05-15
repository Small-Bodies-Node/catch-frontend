import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject } from 'rxjs';

interface IDashboardQuery {
  cached: number;
  days: number;
  errored: number;
  finished: number;
  in_progress: number;
  jobs: number;
}

@Injectable({
  providedIn: 'root',
})
export class CatchApiService {
  private apiUrlSubject = new BehaviorSubject<string>(
    'https://catch-api.astro.umd.edu'
  );
  public apiUrl$ = this.apiUrlSubject.asObservable();

  constructor(private http: HttpClient) {}

  setApiUrl(url: string): void {
    this.apiUrlSubject.next(url);
  }

  getApiUrl(): string {
    return this.apiUrlSubject.getValue();
  }

  fetchFromAPI(route: string): Observable<IDashboardQuery[]> {
    const url = `${this.getApiUrl()}/${route}`;
    console.log('fetching', url);

    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching route: ${route}`, error);
        return throwError(() => new Error(`Error fetching route: ${route}`));
      })
    );
  }

  getStatusQueue(): Observable<any> {
    return this.fetchFromAPI('status/queue');
  }

  getStatusQueries(): Observable<IDashboardQuery[]> {
    return this.fetchFromAPI('status/queries');
  }

  getStatusObservations(): Observable<any> {
    return this.fetchFromAPI('status/sources');
  }

  getStatusUpdates(): Observable<any> {
    return this.fetchFromAPI('status/updates');
  }
}
