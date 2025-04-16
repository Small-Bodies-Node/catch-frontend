import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

/**
 * Constants for email service
 */
export const EMAIL_CONSTANTS = {
  DEFAULT_SUBJECT: 'Email from CATCH'
};

@Injectable({
  providedIn: 'root',
})
export class EmailerService {
  constructor(private http: HttpClient) {}

  /**
   * Sends an email through the AWS API Gateway endpoint with AWS WAF Captcha validation
   * @param name The sender's name
   * @param email The sender's email address
   * @param message The message content
   * @param captchaToken AWS WAF captcha token
   * @returns Observable with success indicator
   */
  sendEmail(
    name: string,
    email: string,
    message: string,
    captchaToken: string
  ): Observable<{ success: boolean }> {
    const apiUrl = environment.awsWafConfig.endpoint;

    return this.http.post<{ success: boolean }>(apiUrl, {
      name,
      email,
      message,
      subject: EMAIL_CONSTANTS.DEFAULT_SUBJECT,
      captchaToken,
    });
  }
}
