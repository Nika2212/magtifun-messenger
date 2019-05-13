import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiNotificationComponent } from './ui-notification.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        UiNotificationComponent
    ],
    declarations: [UiNotificationComponent]
})
export class UiNotificationModule {}
