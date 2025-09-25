import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor(private router: Router) {}

  /**
   * Subscribes to router events to track page views.
   * Call this method once in your AppComponent to enable automatic page view tracking.
   */
  public initPageViewTracking(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-XXXXXXXXXX', {
          // This needs to be replaced with the actual Tracking ID
          page_path: event.urlAfterRedirects,
        });
      });
  }

  /**
   * Tracks a custom event in Google Analytics.
   * @param eventName The name of the event (e.g., 'button_click').
   * @param eventParams Additional parameters for the event.
   */
  public trackEvent(
    eventName: string,
    eventParams: { [key: string]: any }
  ): void {
    gtag('event', eventName, eventParams);
  }
}
