import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UINotificationModel } from './ui-notification.model';
import { RESOURCE } from '../../../resource';


@Injectable({
    providedIn: 'root'
})

export class UINotificationService {
    private notification: Subject<UINotificationModel> = new Subject();

    constructor() {}

    public setNotification(statusCode: number, externalMessage: string = null): void {
        const notify = new UINotificationModel(
            statusCode,
            RESOURCE.NOTIFICATIONS.filter(n => n.code === statusCode)[0].type,
            RESOURCE.NOTIFICATIONS.filter(n => n.code === statusCode)[0].message
        );
        this.notification.next(notify);
    }
    public getNotification(): Observable<UINotificationModel> {
        return this.notification;
    }
}
