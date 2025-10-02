import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Subscription, forkJoin } from 'rxjs';
import { CatchApiService } from '../../../core/services/dashboard-api/catch-api.service';
import { IDashboardSource } from '../../../../models/IDashboardObservations';
import { IDashboardUpdate } from '../../../../models/IDashboardUpdates';
import { PieChartComponent } from '../job-queue/pie-chart.component';

@Component({
  selector: 'app-observations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    PieChartComponent,
  ],
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.scss'],
})
export class ObservationsComponent implements OnInit, OnDestroy {
  @Input() apiUrl!: string;

  allSources: IDashboardSource[] = [];
  updates: IDashboardUpdate[] = [];
  isLoading = true;
  isError = false;
  errorMessage = '';
  private subscription = new Subscription();

  displayedColumns: string[] = [
    'source_name',
    'nights',
    'count',
    'start_date',
    'stop_date',
    'updated',
  ];

  constructor(private catchApiService: CatchApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadData(): void {
    this.isLoading = true;
    this.isError = false;

    this.subscription.add(
      forkJoin({
        sources: this.catchApiService.getStatusSources(),
        updates: this.catchApiService.getStatusUpdates(),
      }).subscribe({
        next: (data): void => {
          this.allSources = data.sources || [];
          console.log('>>> ', data, this.allSources);
          this.updates = data.updates || [];
          this.isLoading = false;
        },
        error: (error): void => {
          this.isError = true;
          this.errorMessage = error.message;
          this.isLoading = false;
        },
      }),
    );
  }

  get sourcesByObservations(): IDashboardSource[] {
    return [...this.allSources]
      .filter((source) => source.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  get totalObservations(): number {
    return this.sourcesByObservations.reduce((total, source) => total + source.count, 0);
  }

  get totalNights(): number {
    return this.sourcesByObservations.reduce((total, source) => total + source.nights, 0);
  }

  get sortedSources(): IDashboardSource[] {
    return [...this.allSources].sort((a, b) => a.source_name.localeCompare(b.source_name));
  }

  getUpdatesForDays(days: number): IDashboardUpdate[] {
    return this.updates.filter((update) => update.days === days);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString.split(' ')[0]);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getUTCFullYear()} ${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
  }

  getObservationLabels(): string[] {
    return this.sourcesByObservations.map(
      (source) => `${source.source_name} (${source.count.toLocaleString()})`,
    );
  }

  getObservationValues(): number[] {
    console.log('>>> getObservationValues', this.sourcesByObservations);
    return this.sourcesByObservations.map((source) => source.count);
  }

  getNightsLabels(): string[] {
    return this.sourcesByObservations.map(
      (source) => `${source.source_name} (${(source.nights || 0).toLocaleString()})`,
    );
  }

  getNightsValues(): number[] {
    return this.sourcesByObservations.map((source) => source.nights);
  }
}
