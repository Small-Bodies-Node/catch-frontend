import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { CatchApiService } from '../../../core/services/dashboard-api/catch-api.service';
import { error } from 'console';

@Component({
  selector: 'app-observations',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.scss'],
})
export class ObservationsComponent implements OnInit, OnDestroy {
  @Input() apiUrl!: string;

  observationsData: any = null;
  isLoading = true;
  isError = false;
  errorMessage = '';
  private subscription = new Subscription();

  constructor(private catchApiService: CatchApiService) {}

  ngOnInit(): void {
    this.loadObservationsData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadObservationsData(): void {
    this.isLoading = true;
    this.subscription.add(
      this.catchApiService.getStatusObservations().subscribe({
        next: (data): void => {
          this.observationsData = data;
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
