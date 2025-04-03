import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  Validators,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { EmailerService } from '../../core/services/emailer/emailer.service';
import { AwsWafCaptchaService } from '../../core/services/aws-waf-captcha/aws-waf-captcha.service';
import { TPermittedTheme } from '../../../models/ISiteSettings';
import { IAppState } from '../../ngrx/reducers';
import { environment } from '../../../environments/environment';
import { selectSiteSettingsEffectiveTheme } from '../../ngrx/selectors/site-settings.selectors';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
  ]
})
export class ContactPageComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  captchaToken: string | undefined;
  theme?: TPermittedTheme;
  // Require user to pass captcha for every new message
  isMessageSendable = false;
  captchaLoading = true;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private emailer: EmailerService,
    private snackBar: MatSnackBar,
    private store$: Store<IAppState>,
    private awsWafCaptchaService: AwsWafCaptchaService
  ) {
    this.subscriptions.add(
      this.store$
        .select(selectSiteSettingsEffectiveTheme)
        .subscribe((theme) => (this.theme = theme))
    );

    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  ngOnInit() {
    // Subscribe to captcha load status
    this.subscriptions.add(
      this.awsWafCaptchaService.getCaptchaLoadStatus().subscribe(
        (loaded) => {
          this.captchaLoading = !loaded;
        }
      )
    );
  }

  ngAfterViewInit() {
    // Initialize AWS WAF Captcha after view has initialized
    setTimeout(() => {
      this.initAwsWafCaptcha();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Initialize the AWS WAF Captcha
   */
  private initAwsWafCaptcha(): void {
    this.awsWafCaptchaService.initCaptcha({
      container: 'aws-waf-captcha-container',
      onSuccess: (token: string) => {
        this.captchaToken = token;
        this.isMessageSendable = true;
        setTimeout(() => this.form?.updateValueAndValidity(), 0);
      },
      onError: (error: Error) => {
        console.error('AWS WAF Captcha error:', error);
        this.isMessageSendable = false;
        this.captchaToken = undefined;
      },
      onExpired: () => {
        this.isMessageSendable = false;
        this.captchaToken = undefined;
      }
    }).subscribe();
  }

  /**
   * Submit the contact form
   */
  submit() {
    if (this.isFormSubmittable()) {
      this.emailer
        .sendEmail(
          this.form?.get('username')?.value || '',
          this.form?.get('email')?.value || '',
          this.form?.get('message')?.value || '',
          this.captchaToken || ''
        )
        .subscribe({
          next: (response) => {
            try {
              if (response.success) {
                this.snackBar.open(
                  'Message Sent. \n\n You must pass the captcha again to send another message.',
                  'Close',
                  { duration: 5000 }
                );
                this.isMessageSendable = false;
                // Reset the form and captcha after successful submission
                this.reset();
                this.awsWafCaptchaService.resetCaptcha();
              }
            } catch (err) {
              this.snackBar.open(
                'An error occurred while sending your message. Please try again.',
                'Close',
                { duration: 5000 }
              );
            }
          },
          error: (err) => {
            console.error('Error sending email:', err);
            this.snackBar.open(
              'An error occurred while sending your message. Please try again.',
              'Close',
              { duration: 5000 }
            );
          }
        });
    }
  }

  /**
   * Reset the form
   */
  reset() {
    this.form?.reset();
    this.form?.clearValidators();
    this.form?.clearAsyncValidators();
  }

  /**
   * Check if the form can be submitted
   * @returns True if the form can be submitted
   */
  isFormSubmittable() {
    const isFormValid =
      !!this.isMessageSendable &&
      !!this.captchaToken &&
      !!this.form?.get('username') &&
      !!this.form.get('email') &&
      !!this.form.get('message') &&
      !this.form.get('message')!.hasError('required') &&
      !this.form.get('message')!.hasError('minlength') &&
      !this.form.get('message')!.hasError('maxlength') &&
      !this.form.get('email')!.hasError('required') &&
      !this.form.get('username')!.hasError('required');
    return isFormValid;
  }
}
