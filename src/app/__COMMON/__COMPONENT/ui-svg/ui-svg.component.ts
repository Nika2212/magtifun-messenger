import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-svg',
  template: `<div [class]="SVG_CLASS" class="content-row-center">
                <img [class]="SVG_CLASS" [ngClass]="{'d-none' : !SVG_STATE}" [src]="SVG_PATH_ACTIVE" alt="">
                <img [class]="SVG_CLASS" [ngClass]="{'d-none' : SVG_STATE}" [src]="SVG_PATH_INACTIVE" alt="">
              </div>`
})
export class UISvgComponent {
  @Input() public SVG_PATH_INACTIVE: string = '';
  @Input() public SVG_PATH_ACTIVE: string = '';
  @Input() public SVG_STATE: boolean = false;
  @Input() public SVG_CLASS: string = '';

  constructor() {}
}
