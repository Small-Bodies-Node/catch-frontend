import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  imports: [
    CommonModule,
    //
    RouterModule,
    RouterLink,
    // RouterOutlet,
    // RouterLinkActive,
  ],
})
export class AboutPageComponent {
  allSkyCoverage = 'assets/images/pngs/sky-coverage-20250725.png';
}
