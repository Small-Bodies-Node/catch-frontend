import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-game-page',
  template: `
    <section class="page game-page">
      <h1>Game</h1>
      <p>This is a placeholder for the Game page.</p>
    </section>
  `,
  styles: [
    `
      .game-page { padding: 1rem; }
    `,
  ],
})
export class GameComponent {}
