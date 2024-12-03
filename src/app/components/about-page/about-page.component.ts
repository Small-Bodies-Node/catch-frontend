import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  standalone: true,
  imports: [CommonModule, MatGridListModule],
})
export class AboutPageComponent implements OnInit {

  allSkyCoverage = 'assets/images/pngs/sky-coverage-20241127.png';

  ngOnInit(): void {}
}
