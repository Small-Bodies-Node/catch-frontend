import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { CatchApiService } from '../../../core/services/dashboard-api/catch-api.service';

@Component({
  selector: 'app-queries',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatListModule],
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss'],
})
export class QueriesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() apiUrl!: string;

  queriesData: any = null;
  isLoading = true;
  isError = false;
  errorMessage = '';
  private subscription = new Subscription();

  constructor(private catchApiService: CatchApiService) {}

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
    console.log('Loading queries data...');
    this.isLoading = true;
    this.subscription.add(
      this.catchApiService.getStatusQueries().subscribe({
        next: (data): void => {
          this.queriesData = data;
          console.log('Queries data:', this.queriesData);
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
