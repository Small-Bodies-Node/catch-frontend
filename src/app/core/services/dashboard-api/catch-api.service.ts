import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, timer, switchMap, retry } from 'rxjs';
import { IDashboardQueue } from '../../../../models/IDashboardQueue';
import { IDashboardSource } from '../../../../models/IDashboardObservations';
import { IDashboardUpdate } from '../../../../models/IDashboardUpdates';

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
  private apiUrlSubject = new BehaviorSubject<string>('https://catch-api.astro.umd.edu');
  public apiUrl$ = this.apiUrlSubject.asObservable();

  constructor(private http: HttpClient) {}

  setApiUrl(url: string): void {
    this.apiUrlSubject.next(url);
  }

  getApiUrl(): string {
    return this.apiUrlSubject.getValue();
  }

  private fetchFromAPI<T>(route: string): Observable<T> {
    const url = `${this.getApiUrl()}/${route}`;

    return this.http.get<T>(url).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        console.error(`Error fetching route: ${route}`, error);
        return throwError(() => new Error(`Failed to fetch ${route}: ${error.message}`));
      }),
    );
  }

  getStatusQueue(): Observable<IDashboardQueue> {
    return this.fetchFromAPI<IDashboardQueue>('status/queue');
  }

  getStatusQueries(): Observable<IDashboardQuery[]> {
    return this.fetchFromAPI<IDashboardQuery[]>('status/queries');
  }

  // getStatusSources(): Observable<IDashboardObservations> {
  getStatusSources(): Observable<IDashboardSource[]> {
    return this.fetchFromAPI<IDashboardSource[]>('status/sources');
  }

  getStatusUpdates(): Observable<IDashboardUpdate[]> {
    return this.fetchFromAPI<IDashboardUpdate[]>('status/updates');
  }

  // Real-time updates with polling
  getRealtimeUpdates(intervalMs: number = 5000): Observable<IDashboardQueue> {
    return timer(0, intervalMs).pipe(switchMap(() => this.getStatusQueue()));
  }
}
