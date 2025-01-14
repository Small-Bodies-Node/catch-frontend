import { bootstrapApplication } from '@angular/platform-browser';
import { AppEntryComponent } from './app/app-entry/app-entry.component';
import { config } from './app/app-entry/app.config.server';

const bootstrap = () => bootstrapApplication(AppEntryComponent, config);

export default bootstrap;
