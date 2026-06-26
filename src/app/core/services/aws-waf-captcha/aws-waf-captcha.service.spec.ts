import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { AwsWafCaptchaService } from './aws-waf-captcha.service';

describe('AwsWafCaptchaService', () => {
  let service: AwsWafCaptchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AwsWafCaptchaService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(AwsWafCaptchaService);
  });

  afterEach(() => {
    delete (window as any).AwsWafCaptcha;
    document.getElementById('test-container')?.remove();
    document.getElementById('waf-captcha-container')?.remove();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initCaptcha', () => {
    it('should render AWS WAF Captcha and emit the success token', fakeAsync(() => {
      const container = document.createElement('div');
      container.id = 'test-container';
      document.body.appendChild(container);

      (service as any).isCaptchaLoaded = true;
      (window as any).AwsWafCaptcha = {
        renderCaptcha: jasmine.createSpy('renderCaptcha').and.callFake(
          (_container: HTMLElement, captchaConfig: { onSuccess: (token: string) => void }) => {
            captchaConfig.onSuccess('test-token');
            return true;
          },
        ),
      };

      const config = {
        container: 'test-container',
        onSuccess: jasmine.createSpy('onSuccess'),
        onError: jasmine.createSpy('onError'),
        onExpired: jasmine.createSpy('onExpired'),
      };

      let emittedToken: string | undefined;
      service.initCaptcha(config).subscribe((token) => {
        emittedToken = token;
      });

      tick(300);

      expect((window as any).AwsWafCaptcha.renderCaptcha).toHaveBeenCalledWith(
        container,
        jasmine.objectContaining({
          onSuccess: jasmine.any(Function),
          onError: jasmine.any(Function),
          onExpired: jasmine.any(Function),
        }),
      );
      expect(emittedToken).toBe('test-token');
      expect(config.onSuccess).toHaveBeenCalledWith('test-token');
    }));

    it('should report an error when the configured container is missing', fakeAsync(() => {
      (service as any).isCaptchaLoaded = true;
      (window as any).AwsWafCaptcha = {
        renderCaptcha: jasmine.createSpy('renderCaptcha'),
      };
      spyOn(console, 'error');

      const config = {
        container: 'test-container',
        onSuccess: jasmine.createSpy('onSuccess'),
        onError: jasmine.createSpy('onError'),
        onExpired: jasmine.createSpy('onExpired'),
      };

      service.initCaptcha(config).subscribe();
      tick(300);

      expect((window as any).AwsWafCaptcha.renderCaptcha).not.toHaveBeenCalled();
      expect(config.onError).toHaveBeenCalledWith(jasmine.any(Error));
    }));
  });

  describe('resetCaptcha', () => {
    it('should clear and re-render the captcha container', fakeAsync(() => {
      const container = document.createElement('div');
      container.id = 'waf-captcha-container';
      container.innerHTML = 'old captcha';
      document.body.appendChild(container);

      (service as any).isCaptchaLoaded = true;
      (window as any).AwsWafCaptcha = {
        renderCaptcha: jasmine.createSpy('renderCaptcha').and.returnValue(true),
      };

      service.resetCaptcha();
      tick(300);

      expect(container.innerHTML).toBe('');
      expect((window as any).AwsWafCaptcha.renderCaptcha).toHaveBeenCalled();
    }));

    it('should handle errors when resetting captcha', fakeAsync(() => {
      const container = document.createElement('div');
      container.id = 'waf-captcha-container';
      document.body.appendChild(container);

      (service as any).isCaptchaLoaded = true;
      (window as any).AwsWafCaptcha = {
        renderCaptcha: jasmine.createSpy('renderCaptcha').and.throwError('Test error'),
      };
      spyOn(console, 'error');

      expect(() => service.resetCaptcha()).not.toThrow();
      tick(300);

      expect(console.error).toHaveBeenCalled();
    }));
  });
});
