import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CatchApiService } from '../../../core/services/dashboard-api/catch-api.service';
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
  ],
  templateUrl: './job-queue.component.html',
  styleUrls: ['./job-queue.component.scss'],
})
export class JobQueueComponent implements OnInit, OnDestroy {
  @Input() apiUrl!: string;

  queueData: any = null;
  isLoading = true;
  isError = false;
  errorMessage = '';
  private subscription = new Subscription();

  constructor(private catchApiService: CatchApiService) {}

  ngOnInit(): void {
    this.loadQueueData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadQueueData(): void {
    this.isLoading = true;
    this.subscription.add(
      this.catchApiService.getStatusQueue().subscribe({
        next: (data): void => {
          this.queueData = data;
          this.isLoading = false;
        },
        error: (error): void => {
          this.isError = true;
          this.errorMessage = error.message;
          this.isLoading = false;
        },
      })
    );
  }
}
