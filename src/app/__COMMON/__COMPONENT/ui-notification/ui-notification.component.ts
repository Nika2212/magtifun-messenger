import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RESOURCE } from '../../../resource';
import { UINotificationModel } from './ui-notification.model';
import { Subscription } from 'rxjs';
import { UINotificationService } from './ui-notification.service';
import {DeviceVibrationService} from '../../__SERVICE/__NATIVE/device-vibration.service';

@Component({
  selector: 'ui-notification',
  templateUrl: './ui-notification.component.html',
  styleUrls: ['./ui-notification.component.scss'],
})
export class UiNotificationComponent implements OnInit {
  @ViewChild('notificationReference') public notificationReference: ElementRef;
  public ASSETS = RESOURCE.ASSETS;
  public notification: UINotificationModel;
  public timer;
  public expanded = false;

  private notificationSubscription: Subscription;

  constructor(private notificationService: UINotificationService,
              private deviceVibrationService: DeviceVibrationService) { }

  public ngOnInit(): void {
    this.notification = new UINotificationModel(null, null, null);
    this.notificationSubscription = this.notificationService.getNotification().subscribe(notification => {
      if (!this.expanded) {
        this.deviceVibrationService.deviceVibrationErrorMethod();
        this.notification = notification;
        this.notificationToggle(true);
      }
    });
  }
  public notificationToggle(state: boolean): void {
    if (state) {
      this.notificationReference.nativeElement.style.transform = `translateY(${0 + 'px'})`;
      this.expanded = true;
      this.timer = setTimeout(() => this.notificationToggle(false), 5 * 1000);
    } else {
      clearTimeout(this.timer);
      // tslint:disable-next-line:max-line-length
      this.notificationReference.nativeElement.style.transform = `translateY(${-80 + 'px'})`;
      setTimeout(() => {
        this.notification.notificationType = null;
        this.notification.notificationMessage = null;
        this.expanded = false;
      }, 300);
    }
  }
}
