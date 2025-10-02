import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  imports: [CommonModule, MatDividerModule, DashboardComponent],
})
export class DashboardPageComponent implements OnInit {
  ngOnInit(): void {}
}
