import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LayoutComponent} from './containers/layout/layout.component';
import {SimpleLayoutComponent} from './containers/simple-layout';
import {environment} from '../environments/environment';
import {ApiModule as SecurityApiModule} from '@services/prizma-server-security-api';
import * as PrizmaServerSecurityApi from '@services/prizma-server-security-api';
import * as ServerApi from '@services/api';
import {AuthService} from '@services/auth.service';
import {Configuration as PrizmaApiConfiguration} from '@services/prizma-api-configuration/configuration';
import {Configuration as ServerApiConfiguration} from '@services/api/configuration';
import {HttpClientModule} from '@angular/common/http';
import {ApiModule} from '@services/api';

export function prizmaApiConfigFactory() {
  return new PrizmaApiConfiguration();
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SimpleLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SecurityApiModule.forRoot(prizmaApiConfigFactory),
    ApiModule.forRoot(prizmaApiConfigFactory),
    HttpClientModule
  ],
  providers: [
    AuthService,
    {provide: PrizmaServerSecurityApi.BASE_PATH, useValue: environment.prizmaServerSecurityUrl},
    {provide: ServerApi.BASE_PATH, useValue: environment.serverUrl},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
