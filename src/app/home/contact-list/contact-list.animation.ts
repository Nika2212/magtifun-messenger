import { animate, query, style, transition, trigger } from '@angular/animations';

export const contactListAnimation = [
    trigger('contact-wrapper', [
        transition(':enter', [
            style({ height: '0' }),
            animate('250ms ease-out', style({ height: '70px' }))
        ]),
        transition(':leave', [
            style({ height: '70px' }),
            animate('250ms ease-out', style({ height: '0' }))
        ]),
    ]),
    trigger('contact-children', [
        transition(':enter', [
            query('.contact', [
                style({ transform: 'rotateX(-90deg)', opacity: 0, borderLeftColor: '#333'}),
                animate('250ms ease-out', style({ transform: 'rotateX(0deg)', opacity: 1, borderLeftColor: '#252525'}))
            ])
        ]),
        transition(':leave', [
            query('.contact', [
                style({ transform: 'rotateX(0deg)', opacity: 1, borderLeftColor: '#252525' }),
                animate('250ms ease-out', style({ transform: 'rotateX(-90deg)', opacity: 0, borderLeftColor: '#333' }))
            ])
        ]),
    ])
];
