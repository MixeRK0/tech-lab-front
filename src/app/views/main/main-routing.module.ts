import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NewComponent} from './new/new.component';
import {ListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: NewComponent,
  },
  {
    path: 'results',
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
  constructor() {
  }
}
