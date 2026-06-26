import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';

import { TEffectiveTheme, TThemePreference } from '../../../../models/ISiteSettings';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly isBrowser: boolean;
  private readonly themePreferenceSubject = new BehaviorSubject<TThemePreference>('system');
  private readonly effectiveThemeSubject = new BehaviorSubject<TEffectiveTheme>('light');
  private systemDarkQuery?: MediaQueryList;
  private systemThemeListener?: (event: MediaQueryListEvent) => void;

  readonly themePreference$ = this.themePreferenceSubject.asObservable();
  readonly effectiveTheme$ = this.effectiveThemeSubject.asObservable();

  constructor(
    private overlayContainer: OverlayContainer,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser && typeof window.matchMedia === 'function') {
      this.systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemThemeListener = () => this.applyTheme();
      this.systemDarkQuery.addEventListener('change', this.systemThemeListener);
    }

    this.applyTheme();
  }

  ngOnDestroy(): void {
    if (this.systemDarkQuery && this.systemThemeListener) {
      this.systemDarkQuery.removeEventListener('change', this.systemThemeListener);
    }
  }

  setThemePreference(themePreference: TThemePreference): void {
    if (this.themePreferenceSubject.value === themePreference) return;
    this.themePreferenceSubject.next(themePreference);
    this.applyTheme();
  }

  private applyTheme(): void {
    const themePreference = this.themePreferenceSubject.value;
    const effectiveTheme = this.resolveEffectiveTheme(themePreference);
    this.effectiveThemeSubject.next(effectiveTheme);

    if (!this.isBrowser) return;

    const themeTargets = [
      this.document.documentElement,
      this.document.body,
      this.overlayContainer.getContainerElement(),
    ];

    themeTargets.forEach((target) => {
      this.removeThemeClasses(target);
      target.classList.add(`catch-theme-${themePreference}`, `catch-effective-${effectiveTheme}`);
    });

    const colorScheme = themePreference === 'system' ? 'light dark' : effectiveTheme;
    this.document.documentElement.style.colorScheme = colorScheme;
    this.document.body.style.colorScheme = colorScheme;
  }

  private resolveEffectiveTheme(themePreference: TThemePreference): TEffectiveTheme {
    if (themePreference !== 'system') return themePreference;
    return this.systemDarkQuery?.matches ? 'dark' : 'light';
  }

  private removeThemeClasses(target: Element): void {
    const oldThemeClasses = Array.from(target.classList).filter(
      (className) =>
        className.startsWith('catch-theme-') || className.startsWith('catch-effective-'),
    );
    if (oldThemeClasses.length) {
      target.classList.remove(...oldThemeClasses);
    }
  }
}
