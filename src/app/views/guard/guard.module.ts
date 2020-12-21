import {NgModule} from '@angular/core';
import {GuardRoutingModule} from './guard-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {CuiControlsModule} from '@shared/cui-controls/cui-controls.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GuardRoutingModule,
    CuiControlsModule
  ],
  declarations: [
    LoginComponent,
  ],
})
export class GuardModule {
}
