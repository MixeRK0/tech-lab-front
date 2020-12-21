import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SimpleLayoutComponent} from './containers/simple-layout';
import {LayoutComponent} from './containers/layout/layout.component';
import {MainModule} from './views/main/main.module';
import {GuardModule} from './views/guard/guard.module';

const routes: Routes = [
  {
    path: 'guard',
    component: SimpleLayoutComponent,
    data: {
      title: 'Авторизация'
    },
    children: [
      {
        path: '',
        loadChildren: () => GuardModule
      }
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    data: {
      title: 'Главная'
    },
    children: [
      {
        path: '',
        loadChildren: () => MainModule
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
