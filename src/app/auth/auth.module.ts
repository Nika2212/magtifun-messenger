import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthPage } from './auth.page';
import {UiNotificationModule} from '../__COMMON/__COMPONENT/ui-notification/ui-notification.module';
import {UISvgModule} from '../__COMMON/__COMPONENT/ui-svg/ui-svg.module';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        UiNotificationModule,
        UISvgModule
    ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
