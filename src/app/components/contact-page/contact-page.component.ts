import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  Validators,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms'; // <-- Add ReactiveFormsModule
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { EmailerService } from '../../core/services/emailer/emailer.service';
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
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule, // <-- Add MatSnackBarModule
    MatInputModule, // <-- Add MatInputModule
    MatButtonModule, // <-- Add MatButtonModule
    MatFormFieldModule, // <-- Add MatFormFieldModule
    MatCardModule, // <-- Add MatCardModule
  ], // <-- Add ReactiveFormsModule
})
export class ContactPageComponent implements OnInit, AfterViewInit, OnDestroy {
  // --->>>

  subscriptions: Subscription = new Subscription();
  recaptchaToken: string | undefined;
  theme?: TPermittedTheme;
  // Require user to perform recaptcha for every new message
  isMessageSendable = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private emailer: EmailerService,
    private snackBar: MatSnackBar,
    private store$: Store<IAppState>
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

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      // @ts-ignore
      (grecaptcha as typeof grecaptcha).render('recaptcha-id', {
        sitekey: environment.recaptchaSiteKey,
        theme: this.theme!.toUpperCase().includes('LIGHT') ? 'light' : 'dark',
        size: 'normal',
        callback: (token: string) => {
          this.recaptchaToken = token;
          this.isMessageSendable = true;
          setTimeout(() => this.form?.updateValueAndValidity(), 0);
        },
        'expired-callback': () => {
          this.isMessageSendable = false;
          this.recaptchaToken = undefined;
        },
        'error-callback': () => {
          // executed when reCAPTCHA encounters an error (usually network connectivity)
        },
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  submit() {
    if (this.isFormSubmittable()) {
      this.emailer
        .sendEmail(
          this.form?.get('username')?.value || '',
          this.form?.get('email')?.value || '',
          this.form?.get('message')?.value || '',
          this.recaptchaToken + ''
        )
        .subscribe((response) => {
          try {
            if (!!response.success) {
              this.snackBar.open(
                'Message Sent. \n\n You must redo the Recaptcha (i.e. wait or refresh page) to send another message.',
                'Close',
                {
                  duration: 5000,
                }
              );
              this.isMessageSendable = false;
            }
          } catch (err) {}
        });
    }
  }

  reset() {
    this.form?.reset();
    this.form?.clearValidators();
    this.form?.clearAsyncValidators();
  }

  isFormSubmittable() {
    const isFormValid =
      !!this.isMessageSendable &&
      !!this.recaptchaToken &&
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
