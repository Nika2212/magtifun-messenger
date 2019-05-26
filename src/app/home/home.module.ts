import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { UISvgModule } from '../__COMMON/__COMPONENT/ui-svg/ui-svg.module';
import { UiNotificationModule } from '../__COMMON/__COMPONENT/ui-notification/ui-notification.module';
import { ContactListModule } from './contact-list/contact-list.module';
import {MessageListModule} from './message-list/message-list.module';
import {OptionsModule} from './options/options.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ContactListModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ]),
        UISvgModule,
        UiNotificationModule,
        MessageListModule,
        OptionsModule
    ],
  declarations: [HomePage]
})
export class HomePageModule {}
