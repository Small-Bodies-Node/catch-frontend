import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';

import { AwsWafCaptchaService } from './aws-waf-captcha.service';
import { environment } from '../../../../environments/environment';

describe('AwsWafCaptchaService', () => {
  let service: AwsWafCaptchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AwsWafCaptchaService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(AwsWafCaptchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initCaptcha', () => {
    it('should return a mock token in test environment', (done) => {
      // Mock the environment to be test/development
      spyOnProperty(environment, 'envName').and.returnValue('test');
      
      const config = {
        container: 'test-container',
        onSuccess: jasmine.createSpy('onSuccess')
      };
      
      service.initCaptcha(config).subscribe(token => {
        expect(token).toBe('mock-token-for-testing');
        expect(config.onSuccess).toHaveBeenCalledWith('mock-token-for-testing');
        done();
      });
    });

    it('should try to initialize AWS WAF Captcha in production', () => {
      // Mock window object
      (window as any).AwsWafCaptcha = {
        renderCaptcha: jasmine.createSpy('renderCaptcha')
      };
      
      spyOnProperty(environment, 'envName').and.returnValue('production');
      
      const config = {
        container: 'test-container',
        onSuccess: jasmine.createSpy('onSuccess')
      };
      
      service.initCaptcha(config).subscribe();
      
      // This should call setTimeout, so we need to flush
      jasmine.clock().install();
      jasmine.clock().tick(200);
      
      expect((window as any).AwsWafCaptcha.renderCaptcha).toHaveBeenCalled();
      
      jasmine.clock().uninstall();
    });
  });

  describe('resetCaptcha', () => {
    it('should call AWS WAF captcha reset if available', () => {
      // Mock window object
      (window as any).AwsWafCaptcha = {
        resetCaptcha: jasmine.createSpy('resetCaptcha')
      };
      
      service.resetCaptcha();
      
      expect((window as any).AwsWafCaptcha.resetCaptcha).toHaveBeenCalled();
    });

    it('should handle errors when resetting captcha', () => {
      // Mock window object with a function that throws
      (window as any).AwsWafCaptcha = {
        resetCaptcha: jasmine.createSpy('resetCaptcha').and.throwError('Test error')
      };
      
      // Spy on console.error
      spyOn(console, 'error');
      
      // This should not throw
      expect(() => service.resetCaptcha()).not.toThrow();
      
      // But should log an error
      expect(console.error).toHaveBeenCalled();
    });
  });
});
