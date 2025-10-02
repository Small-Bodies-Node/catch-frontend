import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { ApiSelectorComponent } from './api-selector/api-selector.component';
import { JobQueueComponent } from './job-queue/job-queue.component';
import { QueriesComponent } from './queries/queries.component';
import { ObservationsComponent } from './observations/observations.component';
import { CatchApiService } from '../../core/services/dashboard-api/catch-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    ApiSelectorComponent,
    JobQueueComponent,
    QueriesComponent,
    ObservationsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnDestroy {
  private subscription = new Subscription();
  apiUrl: string;

  constructor(private catchApiService: CatchApiService) {
    this.apiUrl = this.catchApiService.getApiUrl();
    this.subscription.add(
      this.catchApiService.apiUrl$.subscribe((url) => {
        this.apiUrl = url;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
