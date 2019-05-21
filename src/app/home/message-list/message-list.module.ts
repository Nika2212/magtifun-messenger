import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageListComponent } from './message-list.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        MessageListComponent
    ],
    declarations: [MessageListComponent]
})
export class MessageListModule {}
