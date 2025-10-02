import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PieChartComponent } from './pie-chart.component';
import { CatchApiService } from '../../../core/services/dashboard-api/catch-api.service';
import { IDashboardQueue, IDashboardJob } from '../../../../models/IDashboardQueue';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-queue',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    PieChartComponent,
  ],
  templateUrl: './job-queue.component.html',
  styleUrls: ['./job-queue.component.scss'],
})
export class JobQueueComponent implements OnInit, OnDestroy {
  @Input() apiUrl!: string;

  queueData: IDashboardQueue | null = null;
  isLoading = true;
  isError = false;
  errorMessage = '';
  isRefreshing = false;
  private subscription = new Subscription();

  constructor(
    private catchApiService: CatchApiService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadQueueData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadQueueData(): void {
    this.isLoading = true;
    this.isError = false;
    this.subscription.add(
      this.catchApiService.getStatusQueue().subscribe({
        next: (data): void => {
          this.queueData = data;
          this.isLoading = false;
          this.isRefreshing = false;
        },
        error: (error): void => {
          this.isError = true;
          this.errorMessage = error.message;
          this.isLoading = false;
          this.isRefreshing = false;
          this.snackBar.open(`Failed to load queue data: ${error.message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      }),
    );
  }

  refreshQueue(): void {
    this.isRefreshing = true;
    this.loadQueueData();
  }

  getJobStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'running':
        return 'status-running';
      case 'queued':
        return 'status-queued';
      case 'completed':
        return 'status-completed';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-unknown';
    }
  }
}
