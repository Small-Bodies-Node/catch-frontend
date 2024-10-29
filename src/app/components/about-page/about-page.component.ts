import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AboutPageComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    this.httpClient
      .get(
        'https://catch-dev-api.astro.umd.edu/catch?cached=true&target=562274'
      )
      .subscribe((data) => {
        console.log('data', data);
      });
  }

  ngOnInit(): void {}
}
