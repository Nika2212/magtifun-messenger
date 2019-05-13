import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UISvgComponent } from './ui-svg.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        UISvgComponent
    ],
    declarations: [UISvgComponent]
})
export class UISvgModule {}
