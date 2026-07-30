import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cat-firework',
  templateUrl: './cat-firework.component.html',
  styleUrls: ['./cat-firework.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CatFireworkComponent {}
