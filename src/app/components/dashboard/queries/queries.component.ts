import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import {
  CatchApiService,
  IDashboardQuery,
} from '../../../core/services/dashboard-api/catch-api.service';

@Component({
  selector: 'app-queries',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss'],
})
export class QueriesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() apiUrl!: string;

  queriesData: IDashboardQuery[] | null = null;
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
    this.loadQueriesData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiUrl'] && !changes['apiUrl'].firstChange) {
      this.loadQueriesData();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadQueriesData(): void {
    this.isLoading = true;
    this.isError = false;
    this.subscription.add(
      this.catchApiService.getStatusQueries().subscribe({
        next: (data): void => {
          this.queriesData = data;
          this.isLoading = false;
          this.isRefreshing = false;
        },
        error: (error): void => {
          this.isError = true;
          this.errorMessage = error.message;
          this.isLoading = false;
          this.isRefreshing = false;
          this.snackBar.open(`Failed to load queries data: ${error.message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      }),
    );
  }

  refreshQueries(): void {
    this.isRefreshing = true;
    this.loadQueriesData();
  }

  getThirtyDaySummary(): IDashboardQuery | null {
    // History windows overlap; adding them would count recent activity more than once.
    return this.queriesData?.find((query) => query.days === 30) ?? null;
  }
}
