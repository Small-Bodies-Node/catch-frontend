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
      this.loadAwsWafCaptchaScript();
    }
  }

  /**
   * Load the AWS WAF Captcha script dynamically
   */
  private loadAwsWafCaptchaScript(): void {
    // Check if script is already loaded
    if (document.querySelector('script[src*="awswaf-captcha"]')) {
      this.isCaptchaLoaded = true;
      this.isCaptchaLoadedSubject.next(true);
      return;
    }

    // For debugging locally
    if (this.forceLocalDebug || !environment.production) {
      console.log('Using debug captcha for local testing');

      // Create simple mock version for debugging
      (window as any).AwsWafCaptcha = {
        renderCaptcha: (config: any) => {
          console.log('Debug captcha config:', config);

          const container = document.getElementById(config.containerId);
          if (container) {
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
          } else {
            console.error(`Container #${config.containerId} not found`);
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
      return;
    }

    // Production implementation - load the real script
    try {
      const script = document.createElement('script');

      script.src =
        environment.awsWafConfig.captchaScriptUrl ||
        `https://us-east-1.captcha.awswaf.com/api/v1/${environment.awsWafConfig.webAclId}/captcha.js`;

      script.async = true;

      script.onload = () => {
        console.log('AWS WAF Captcha script loaded successfully');
        this.isCaptchaLoaded = true;
        this.isCaptchaLoadedSubject.next(true);
      };

      script.onerror = (e) => {
        console.error('AWS WAF Captcha script failed to load', e);
        this.isCaptchaLoadedSubject.next(false);

        // Fall back to debug implementation
        this.forceLocalDebug = true;
        this.loadAwsWafCaptchaScript();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error('Error loading AWS WAF Captcha script:', error);
      this.isCaptchaLoadedSubject.next(false);

      // Fall back to debug implementation
      this.forceLocalDebug = true;
      this.loadAwsWafCaptchaScript();
    }
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

    if (this.forceLocalDebug || !environment.production) {
      // Handle debug mode
      setTimeout(() => {
        if ((window as any).AwsWafCaptcha) {
          try {
            (window as any).AwsWafCaptcha.renderCaptcha({
              containerId: config.container,
              apiKey: 'debug-api-key',
              onSuccess: (token: string) => {
                tokenSubject.next(token);
                if (config.onSuccess) {
                  config.onSuccess(token);
                }
              },
              onError: (error: Error) => {
                console.error('Debug captcha error:', error);
                if (config.onError) {
                  config.onError(error);
                }
              },
              onExpired: () => {
                console.log('Debug captcha expired');
                if (config.onExpired) {
                  config.onExpired();
                }
              },
            });
          } catch (error) {
            console.error('Error initializing debug captcha:', error);
            if (config.onError) {
              config.onError(error as Error);
            }
          }
        }
      }, 100);

      return tokenSubject.asObservable();
    }

    // Production implementation with minimal complexity
    const render = () => {
      console.log('Debug 0');
      try {
        if (!this.isCaptchaLoaded || !(window as any).AwsWafCaptcha) {
          setTimeout(render, 300);
          return;
        }

        console.log('Debug 1');

        const containerElement = document.getElementById(config.container);
        if (!containerElement) {
          setTimeout(render, 300);
          return;
        }

        console.log('Debug 2', (window as any).AwsWafCaptcha);
        console.log('>>>', config, environment);

        (window as any).AwsWafCaptcha.renderCaptcha({
          containerId: config.container,
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
        this.loadAwsWafCaptchaScript();
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
        (window as any).AwsWafCaptcha.resetCaptcha();
      } catch (e) {
        console.error('Error resetting captcha:', e);
      }
    }
  }

  /**
   * Get the captcha load status as an observable
   */
  getCaptchaLoadStatus(): Observable<boolean> {
    return this.isCaptchaLoadedSubject.asObservable();
  }
}
