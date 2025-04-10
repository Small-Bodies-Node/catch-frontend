import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject, from } from 'rxjs';
import { environment } from '../../../../environments/environment';

/**
 * Service to handle AWS WAF CAPTCHA integration
 */
@Injectable({
  providedIn: 'root',
})
export class AwsWafCaptchaService {
  private captchaLoaded = false;
  private captchaLoadSubject = new Subject<boolean>();

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
      this.captchaLoaded = true;
      this.captchaLoadSubject.next(true);
      return;
    }

    // For testing purposes in development, we'll use a mock implementation
    if (environment.envName === 'default' || !environment.production) {
      console.log('Using mock AWS WAF Captcha implementation for development');

      // Define a mock AWS WAF Captcha object
      (window as any).AwsWafCaptcha = {
        renderCaptcha: (config: any) => {
          console.log('Mock AWS WAF Captcha rendered', config);

          // Create a visual mock captcha (this is important - we need to create something visible!)
          const container = document.getElementById(config.containerId);
          if (container) {
            container.innerHTML = `
              <div style="border: 1px solid #ccc; padding: 10px; text-align: center; border-radius: 4px; background-color: #f9f9f9;">
                <p style="margin-bottom: 10px; font-weight: bold;">Mock AWS WAF Captcha (Development Mode)</p>
                <button
                  id="mock-captcha-pass"
                  type="button"
                  style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  I'm not a robot (Click to pass)
                </button>
              </div>
            `;

            // Add click handler for the mock captcha button
            const captchaButton = document.getElementById('mock-captcha-pass');
            if (captchaButton) {
              // Prevent default behavior to ensure it doesn't submit the form
              captchaButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                console.log('Mock captcha passed');
                if (config.onSuccess) {
                  config.onSuccess('mock-token-for-testing');
                }
              });
            }
          } else {
            console.error(
              `Container with ID ${config.containerId} not found for mock AWS WAF Captcha`
            );
          }
          return true;
        },
        resetCaptcha: () => {
          console.log('Mock AWS WAF Captcha reset');
          return true;
        },
      };

      // Important: signal that captcha is loaded so the loading message disappears
      this.captchaLoaded = true;
      this.captchaLoadSubject.next(true);

      return;
    }

    // In production, attempt to load the real AWS WAF Captcha script
    try {
      const script = document.createElement('script');
      
      // Use the configured script URL from environment
      script.src = environment.awsWafConfig.captchaScriptUrl || 
        `https://us-east-1.captcha.awswaf.com/api/v1/${environment.awsWafConfig.webAclId}/captcha.js`;
      
      script.async = true;

      script.onload = () => {
        console.log('AWS WAF Captcha script loaded successfully');
        this.captchaLoaded = true;
        this.captchaLoadSubject.next(true);
      };

      script.onerror = (e) => {
        console.error('AWS WAF Captcha script failed to load', e);
        this.captchaLoadSubject.next(false);

        // Fallback to mock implementation if script fails to load
        this.initMockImplementation();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error('Error loading AWS WAF Captcha script:', error);
      this.captchaLoadSubject.next(false);

      // Fallback to mock implementation if script fails to load
      this.initMockImplementation();
    }
  }

  /**
   * Initialize a mock implementation for local development or when script loading fails
   */
  private initMockImplementation(): void {
    console.log('Initializing mock AWS WAF Captcha implementation as fallback');

    // Define a mock AWS WAF Captcha object
    (window as any).AwsWafCaptcha = {
      renderCaptcha: (config: any) => {
        console.log('Mock AWS WAF Captcha rendered from fallback', config);

        // Create a visual mock captcha
        const container = document.getElementById(config.containerId);
        if (container) {
          container.innerHTML = `
            <div style="border: 1px solid #ccc; padding: 10px; text-align: center; border-radius: 4px; background-color: #f9f9f9;">
              <p style="margin-bottom: 10px; font-weight: bold;">Mock AWS WAF Captcha (Fallback)</p>
              <button
                id="mock-captcha-pass"
                type="button"
                style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                I'm not a robot (Click to pass)
              </button>
            </div>
          `;

          // Add click handler for the mock captcha button with explicit event prevention
          const captchaButton = document.getElementById('mock-captcha-pass');
          if (captchaButton) {
            captchaButton.addEventListener('click', (event) => {
              event.preventDefault();
              event.stopPropagation();
              console.log('Mock captcha passed (fallback)');
              if (config.onSuccess) {
                config.onSuccess('mock-token-for-testing');
              }
            });
          }
        } else {
          console.error(
            `Container with ID ${config.containerId} not found for fallback AWS WAF Captcha`
          );
        }
        return true;
      },
      resetCaptcha: () => {
        console.log('Mock AWS WAF Captcha reset');
        return true;
      },
    };

    // Important: signal that captcha is loaded so the loading message disappears
    this.captchaLoaded = true;
    this.captchaLoadSubject.next(true);
  }

  /**
   * Initialize AWS WAF Captcha in the provided container
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

    const initCaptchaWhenLoaded = () => {
      if (!this.captchaLoaded || !(window as any).AwsWafCaptcha) {
        console.log('Waiting for AWS WAF Captcha to load...');
        setTimeout(initCaptchaWhenLoaded, 100);
        return;
      }

      try {
        // Ensure the container element exists before trying to render
        const containerElement = document.getElementById(config.container);
        if (!containerElement) {
          console.log(`Container #${config.container} not found, retrying in 200ms...`);
          setTimeout(initCaptchaWhenLoaded, 200);
          return;
        }
        
        console.log(
          'Rendering AWS WAF Captcha in container:',
          config.container
        );
        (window as any).AwsWafCaptcha.renderCaptcha({
          containerId: config.container,
          apiKey: environment.awsWafConfig.apiKey,
          onSuccess: (token: string) => {
            console.log('AWS WAF Captcha success, token received');
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
      } catch (error) {
        console.error('Error initializing AWS WAF Captcha:', error);
        if (config.onError) {
          config.onError(error as Error);
        }
      }
    };

    initCaptchaWhenLoaded();

    return tokenSubject.asObservable();
  }

  /**
   * Reset the captcha to allow a new attempt
   */
  resetCaptcha(): void {
    if (
      isPlatformBrowser(this.platformId) &&
      this.captchaLoaded &&
      (window as any).AwsWafCaptcha
    ) {
      try {
        (window as any).AwsWafCaptcha.resetCaptcha();
      } catch (error) {
        console.error('Error resetting AWS WAF Captcha:', error);
      }
    }
  }

  /**
   * Get the captcha load status as an observable
   */
  getCaptchaLoadStatus(): Observable<boolean> {
    return this.captchaLoadSubject.asObservable();
  }
}
