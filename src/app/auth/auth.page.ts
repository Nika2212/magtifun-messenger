import {Component, OnDestroy, OnInit} from '@angular/core';
import { MagticomService } from '../__COMMON/__SERVICE/__API/magticom.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RESOURCE } from '../resource';
import { UINotificationService } from '../__COMMON/__COMPONENT/ui-notification/ui-notification.service';
import { StatusBarService } from '../__COMMON/__SERVICE/__NATIVE/status-bar.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  public ASSETS = RESOURCE.ASSETS;
  public inPageProcessState: boolean = false;
  public passwordVisibilityState: boolean = false;

  constructor(private magticomService: MagticomService,
              private router: Router,
              private notificationService: UINotificationService,
              private statusBarService: StatusBarService) {}


  public ionViewWillEnter() {
    this.statusBarService.statusBarFillRedMethod();
  }
  public ionViewWillLeave() {
    this.inPageProcessState = false;
  }

  public authSignInMethod(form: NgForm): void {
    const username = form.value.username.toString().trim().replace(' ', '');
    const password = form.value.password.trim();
    if (this.validateCredentialMethod(username, password) && !this.inPageProcessState) {
      this.inPageProcessState = true;
      this.magticomService.login(username, password)
          .then(() => {
            this.magticomService.update()
                .then(() => this.router.navigate(['home']))
                .catch((err) => this.notificationService.setNotification(err));
          })
          .catch(errorCode => {
            this.inPageProcessState = false;
            this.notificationService.setNotification(errorCode);
          });
    } else {
      this.notificationService.setNotification(403);
    }
  }
  public togglePasswordVisibilityStateMethod(): void {
    this.passwordVisibilityState = !this.passwordVisibilityState;
  }

  private validateCredentialMethod(username: string, password: string): boolean {
    // tslint:disable-next-line:radix
    return !isNaN(parseInt(username)) && username.length === 9 && password.length >= 6;
  }
}
