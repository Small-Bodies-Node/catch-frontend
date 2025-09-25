import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-apis-page',
  template: `
    <section class="page apis-page">
      <h1>APIs</h1>
      <p>This is a placeholder for the APIs page.</p>
    </section>
  `,
  styles: [
    `
      .apis-page { padding: 1rem; }
    `,
  ],
})
export class ApisComponent {}
