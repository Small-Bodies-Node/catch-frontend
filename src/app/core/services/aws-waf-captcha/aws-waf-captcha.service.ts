import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

/**
 * Service to handle AWS WAF CAPTCHA integration
 */
@Injectable({
  providedIn: 'root',
})
export class AwsWafCaptchaService {
  private isCaptchaLoaded = false;
  private isCaptchaLoadedSubject = new Subject<boolean>();

  // Force local debugging mode - change to false to test real captcha
  private forceLocalDebug = !true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Check if AWS WAF Captcha is available after a short delay
      setTimeout(() => this.checkAwsWafCaptchaAvailability(), 500);
    }
  }

  /**
   * Check if AWS WAF Captcha is available in the window object
   */
  private checkAwsWafCaptchaAvailability(): void {
    // For debugging locally
    if (this.forceLocalDebug || !environment.production) {
      console.log('Using debug captcha for local testing');
      this.setupDebugCaptcha();
      return;
    }

    // Check if the script is loaded and AwsWafCaptcha is available
    if ((window as any).AwsWafCaptcha) {
      console.log('AWS WAF Captcha is available');
      this.isCaptchaLoaded = true;
      this.isCaptchaLoadedSubject.next(true);
    } else {
      console.warn('AWS WAF Captcha is not available yet, retrying...');
      // Retry after a short delay
      setTimeout(() => {
        if ((window as any).AwsWafCaptcha) {
          console.log('AWS WAF Captcha is now available');
          this.isCaptchaLoaded = true;
          this.isCaptchaLoadedSubject.next(true);
        } else {
          console.error('AWS WAF Captcha failed to load after retries');
          this.isCaptchaLoadedSubject.next(false);

          // Fall back to debug implementation
          this.forceLocalDebug = true;
          this.setupDebugCaptcha();
        }
      }, 1000);
    }
  }

  /**
   * Setup debug captcha for local development
   */
  private setupDebugCaptcha(): void {
    // Create simple mock version for debugging
    (window as any).AwsWafCaptcha = {
      renderCaptcha: (container: HTMLElement, config: any) => {
        console.log('Debug captcha config:', config);

        container.innerHTML = `
          <div style="border: 2px solid #4285f4; padding: 15px; border-radius: 4px; background-color: #f8f9fa; text-align: center;">
            <div style="font-weight: bold; margin-bottom: 10px; color: #1a73e8;">Local Debug Captcha</div>
            <button
              id="debug-captcha-button"
              style="background-color: #1a73e8; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
              Click to generate token
            </button>
          </div>
        `;

        const button = document.getElementById('debug-captcha-button');
        if (button) {
          button.addEventListener('click', (event) => {
            event.preventDefault();
            if (config.onSuccess) {
              const token = 'debug-token-' + Date.now();
              console.log('Generated debug token:', token);
              config.onSuccess(token);
            }
          });
        }
        return true;
      },
      resetCaptcha: () => {
        console.log('Debug captcha reset');
        return true;
      },
    };

    this.isCaptchaLoaded = true;
    this.isCaptchaLoadedSubject.next(true);
  }

  /**
   * Get the captcha load status as an observable
   */
  getCaptchaLoadStatus(): Observable<boolean> {
    return this.isCaptchaLoadedSubject.asObservable();
  }

  /**
   * Initialize the AWS WAF Captcha
   * @param config Configuration for AWS WAF Captcha
   * @returns Observable that emits the captcha token on success
   */
  initCaptcha(config: {
    container: string;
    onSuccess: (token: string) => void;
    onError: (error: Error) => void;
    onExpired: () => void;
  }): Observable<string> {
    const tokenSubject = new Subject<string>();

    if (!isPlatformBrowser(this.platformId)) {
      return tokenSubject.asObservable();
    }

    const render = () => {
      console.log('Debug 0');
      try {
        if (!this.isCaptchaLoaded || !(window as any).AwsWafCaptcha) {
          setTimeout(render, 300);
          return;
        }

        console.log('Debug 1');

        // Get the container element by ID
        const containerElement = document.getElementById(config.container);
        if (!containerElement) {
          console.error(
            `Container element with ID "${config.container}" not found`
          );
          if (config.onError) {
            config.onError(
              new Error(
                `Container element with ID "${config.container}" not found`
              )
            );
          }
          return;
        }

        console.log('Debug 2', (window as any).AwsWafCaptcha);
        console.log('>>>', config, environment);

        // Pass the container element as first param and config as second param
        (window as any).AwsWafCaptcha.renderCaptcha(containerElement, {
          apiKey: environment.awsWafConfig.apiKey,
          onSuccess: (token: string) => {
            tokenSubject.next(token);
            if (config.onSuccess) {
              config.onSuccess(token);
            }
          },
          onError: (error: Error) => {
            console.error('AWS WAF Captcha error:', error);
            if (config.onError) {
              config.onError(error);
            }
          },
          onExpired: () => {
            console.log('AWS WAF Captcha expired');
            if (config.onExpired) {
              config.onExpired();
            }
          },
        });

        console.log('Debug 3');
      } catch (error) {
        console.error('Error rendering captcha:', error);

        // Fall back to debug mode if we have issues in production
        this.forceLocalDebug = true;
        this.setupDebugCaptcha();
        setTimeout(() => this.initCaptcha(config).subscribe(), 300);
      }
    };

    // Start rendering after a delay
    setTimeout(render, 300);

    return tokenSubject.asObservable();
  }

  /**
   * Reset the captcha to allow a new attempt
   */
  resetCaptcha(): void {
    if (
      isPlatformBrowser(this.platformId) &&
      this.isCaptchaLoaded &&
      (window as any).AwsWafCaptcha
    ) {
      try {
        // Remove the existing captcha container's contents
        const container = document.getElementById('waf-captcha-container');
        if (container) {
          container.innerHTML = '';
        }
        // Re-render the captcha widget
        this.initCaptcha({
          container: 'waf-captcha-container',
          onSuccess: (token: string) => {
            console.log('Captcha token:', token);
          },
          onError: (error: Error) => {
            console.error('Captcha error:', error);
          },
          onExpired: () => {
            console.log('Captcha expired');
          },
        });
      } catch (e) {
        console.error('Error resetting captcha:', e);
      }
    }
  }
}
