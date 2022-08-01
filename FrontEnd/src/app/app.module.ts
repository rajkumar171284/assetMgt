import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';
import {environment} from '../environments/environment';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { PushNotificationModule } from 'ng-push-notification';

@NgModule({
  declarations: [
    AppComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule, SharedModule,
    PushNotificationModule.forRoot(),
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    //   registrationStrategy: 'registerWhenStable:30000'
    // }),
  ],

  providers: [AuthService, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
