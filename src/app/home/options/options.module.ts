import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsComponent } from './options.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        OptionsComponent
    ],
    declarations: [OptionsComponent]
})
export class OptionsModule {}
