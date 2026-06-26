import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cat-tools-stack',
  templateUrl: './cat-tools-stack.component.html',
  styleUrls: ['./cat-tools-stack.component.scss'],
  imports: [MatIconModule, NgTemplateOutlet],
  standalone: true,
})
export class CatToolsStackComponent {
  @ViewChild('detailBody')
  private detailBody?: ElementRef<HTMLElement>;

  @Input()
  isDetailOpen = false;

  @Input()
  detailTitle = '';

  @Input()
  listTemplate?: TemplateRef<unknown>;

  @Input()
  detailTemplate?: TemplateRef<unknown>;

  @Input()
  detailActionsTemplate?: TemplateRef<unknown>;

  @Output()
  back = new EventEmitter<void>();

  onBackClick(): void {
    this.back.emit();
  }

  scrollDetailTargetIntoView(targetName: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.scrollDetailTargetIntoViewWhenReady(targetName, 8);
  }

  private scrollDetailTargetIntoViewWhenReady(targetName: string, attemptsRemaining: number): void {
    window.requestAnimationFrame(() => {
      const detailBody = this.detailBody?.nativeElement;
      const target = this.getScrollTarget(targetName);

      if (!detailBody || !target) {
        if (attemptsRemaining > 0) {
          this.scrollDetailTargetIntoViewWhenReady(targetName, attemptsRemaining - 1);
        }

        return;
      }

      const bodyRect = detailBody.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const top = detailBody.scrollTop + targetRect.top - bodyRect.top - 8;

      detailBody.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      });
    });
  }

  private getScrollTarget(targetName: string): HTMLElement | null {
    const detailBody = this.detailBody?.nativeElement;
    if (!detailBody) {
      return null;
    }

    return (
      Array.from(detailBody.querySelectorAll<HTMLElement>('[data-cat-scroll-target]')).find(
        (element) => element.dataset['catScrollTarget'] === targetName,
      ) ?? null
    );
  }
}
