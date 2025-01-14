import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-page',
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TermsPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
