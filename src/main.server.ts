import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app-root/app';
import { config } from './app/app-root/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
