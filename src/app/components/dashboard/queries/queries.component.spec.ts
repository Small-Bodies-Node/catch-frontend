import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CatchApiService,
  IDashboardQuery,
} from '../../../core/services/dashboard-api/catch-api.service';
import { QueriesComponent } from './queries.component';

describe('QueriesComponent 30-day summary', () => {
  const history = (days: number, jobs: number, cached: number, errored: number): IDashboardQuery => ({
    days,
    jobs,
    cached,
    errored,
    finished: 0,
    in_progress: 0,
  });

  let component: QueriesComponent;

  beforeEach(() => {
    component = new QueriesComponent(
      jasmine.createSpyObj<CatchApiService>('CatchApiService', ['getStatusQueries']),
      jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']),
    );
  });

  it('uses the 30-day counts without adding overlapping histories, regardless of order', () => {
    const day = history(1, 5, 3, 1);
    const week = history(7, 20, 10, 2);
    const month = history(30, 100, 50, 8);

    for (const entries of [[day, week, month], [month, day, week], [week, month, day]]) {
      component.queriesData = entries;
      const originalEntries = [...entries];

      expect(component.getThirtyDaySummary()).toBe(month);
      expect(component.queriesData).toEqual(originalEntries);
    }
  });

  it('returns unavailable when the 30-day history is absent', () => {
    for (const entries of [null, [], [history(1, 5, 3, 1), history(7, 20, 10, 2)]]) {
      component.queriesData = entries;

      expect(component.getThirtyDaySummary()).toBeNull();
    }
  });

  it('preserves genuine zero counts', () => {
    const month = history(30, 0, 0, 0);
    component.queriesData = [month];

    expect(component.getThirtyDaySummary()).toEqual(month);
  });

  it('reflects refreshed data without retaining a stale 30-day summary', () => {
    component.queriesData = [history(30, 100, 50, 8)];
    expect(component.getThirtyDaySummary()?.jobs).toBe(100);

    const refreshedMonth = history(30, 110, 55, 9);
    component.queriesData = [refreshedMonth];
    expect(component.getThirtyDaySummary()).toBe(refreshedMonth);

    component.queriesData = [history(1, 5, 3, 1)];
    expect(component.getThirtyDaySummary()).toBeNull();
  });
});
