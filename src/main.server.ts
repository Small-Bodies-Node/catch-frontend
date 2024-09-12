import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app-entry/app.component';
import { config } from './app/app-entry/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
