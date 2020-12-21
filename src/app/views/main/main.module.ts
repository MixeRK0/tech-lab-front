import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MainRoutingModule} from './main-routing.module';
import {NewComponent} from './new/new.component';
import {CuiControlsModule} from '@shared/cui-controls/cui-controls.module';
import {AppPreloaderComponent} from './app-preloader/app-preloader.component';
import {ResultComponent} from './result/result.component';
import {EditComponent} from './edit/edit.component';
import {ListComponent} from './list/list.component';
import {ResultService} from '@services/api';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    CommonModule,
    FormsModule,
    CuiControlsModule,
  ],
  declarations: [
    NewComponent,
    AppPreloaderComponent,
    ResultComponent,
    EditComponent,
    ListComponent
  ],
  providers: [
    ResultService
  ],
})
export class MainModule {
}

