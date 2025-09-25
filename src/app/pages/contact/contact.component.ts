import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contact-page',
  template: `
    <section class="page contact-page">
      <h1>Contact</h1>
      <p>This is a placeholder for the Contact page.</p>
    </section>
  `,
  styles: [
    `
      .contact-page { padding: 1rem; }
    `,
  ],
})
export class ContactComponent {}
