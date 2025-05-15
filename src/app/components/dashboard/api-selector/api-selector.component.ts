import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CatchApiService } from '../../../core/services/dashboard-api/catch-api.service';

@Component({
  selector: 'app-api-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './api-selector.component.html',
  styleUrls: ['./api-selector.component.scss'],
})
export class ApiSelectorComponent {
  @Input() apiUrl!: string;

  apiOptions = [
    { value: 'https://catch-api.astro.umd.edu', label: 'Production' },
    { value: 'https://catch-dev-api.astro.umd.edu', label: 'Development' },
  ];

  constructor(private catchApiService: CatchApiService) {}

  onApiChange(event: any): void {
    this.catchApiService.setApiUrl(event.value);
  }
}
