import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AboutPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
