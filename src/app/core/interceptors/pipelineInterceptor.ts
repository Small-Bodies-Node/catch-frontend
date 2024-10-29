import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { timeout, map, catchError } from 'rxjs/operators';
import { apiDefaultTimeoutMs } from '../../../utils/constants';

export const pipelineInterceptor: HttpInterceptorFn = (req, next) => {
  // Instead of constructor injection, we use inject()
  const snackBar = inject(MatSnackBar);

  console.log('Being used?!');

  // Get timeout value from headers
  const timeoutValue =
    parseInt(req.headers.get('timeout') || `${apiDefaultTimeoutMs}`, 10) ||
    apiDefaultTimeoutMs;

  return next(req).pipe(
    // Handle response events
    map((event) => {
      if (event instanceof HttpResponse) {
        // Do sth with response
        console.log('Request event:', event);
      }
      return event;
    }),

    // Apply timeout
    timeout(timeoutValue),

    // Error handling
    catchError((error: HttpErrorResponse) => {
      console.log('Error:', error);
      let errorMessage = '';
      let clientMessage = '';

      if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error Message: ${error.error.message}`;
        clientMessage = `A network error occurred originating in your browser.`;
      } else {
        // server-side error
        errorMessage = `Error Message: ${error.message}`;
        clientMessage = `The data API is unreachable. Please check your connection or try again later.`;
      }

      // Show snackbar message
      snackBar.open(clientMessage, 'Close', {
        duration: 5000,
      });

      console.log('######', errorMessage);
      return throwError(() => new Error(errorMessage));
    }),

    // Final mapping
    map(
      (event) => {
        console.log('API pipeline completed', event);
        return event;
      },
      (err: any) => {
        console.log('Got that error');
        return err;
      }
    )
  );
};
