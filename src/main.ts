import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app-entry/app.config';
import { AppEntryComponent } from './app/app-entry/app-entry.component';

bootstrapApplication(AppEntryComponent, appConfig).catch((err) =>
  console.error(err)
);
