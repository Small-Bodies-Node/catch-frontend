import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-terms-page',
  template: `
    <section class="page terms-page">
      <h1>Terms</h1>
      <p>This is a placeholder for the Terms page.</p>
    </section>
  `,
  styles: [
    `
      .terms-page { padding: 1rem; }
    `,
  ],
})
export class TermsComponent {}
