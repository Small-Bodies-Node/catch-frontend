import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmailerService {
  constructor(private http: HttpClient) {}

  sendEmail(
    name: string,
    email: string,
    message: string,
    recaptchaToken?: string
  ): Observable<{ success: boolean }> {
    const apiUrl = '';

    return this.http.post<any>(`${apiUrl}/contact/`, {
      name,
      email,
      message,
      recaptchaToken,
    });
  }
}
