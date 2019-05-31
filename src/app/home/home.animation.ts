import {animate, style, transition, trigger} from '@angular/animations';

export const homeComposerAnimation = [
    trigger('composer', [
        transition(':enter', [
            style({ transform: 'translateY(30px)', opacity: 0.5 }),
            animate('125ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
        ])
    ]),
];
