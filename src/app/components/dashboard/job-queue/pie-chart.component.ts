import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent {
  @Input() values: number[] = [];
  @Input() maximum: number = 1;
  @Input() labels?: string[];
  @Input() legend: boolean = false;
  @Input() labelWedges: boolean = false;
  @Input() title?: string;

  colors: string[] = [
    'rgb(31 119 180)',
    'rgb(174 199 232)',
    'rgb(256 127 14)',
    'rgb(256 187 120)',
    'rgb(44 160 44)',
    'rgb(152 223 138)',
    'rgb(214 39 40)',
    'rgb(256 152 150)',
    'rgb(148 103 189)',
    'rgb(197 176 213)',
    'rgb(140 86 75)',
    'rgb(196 156 148)',
    'rgb(227 119 194)',
    'rgb(247 182 210)',
    'rgb(127 127 127)',
    'rgb(199 199 199)',
    'rgb(188 189 34)',
    'rgb(219 219 141)',
    'rgb(23 190 207)',
    'rgb(158 218 229)',
  ];

  public Math = Math;

  radians(a: number): number {
    return (a * Math.PI) / 180;
  }

  getWedges() {
    if (!this.values || this.values.length === 0 || this.maximum === 0) {
      return [];
    }

    let start = 0;
    return this.values.map((value, i) => {
      const arcLength = (value / this.maximum) * 360;
      const wedge = {
        label: this.labelWedges ? value.toString() : undefined,
        start,
        arcLength,
        color: this.colors[i % this.colors.length],
        textColor: 'white',
        index: i,
      };
      start += arcLength;
      return wedge;
    });
  }

  get isEmpty(): boolean {
    return !this.values || this.values.length === 0 || this.maximum === 0;
  }
}
