import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { MagticomService } from './__COMMON/__SERVICE/__API/magticom.service';
import { UINotificationService } from './__COMMON/__COMPONENT/ui-notification/ui-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(private platform: Platform,
              private router: Router,
              private notificationService: UINotificationService,
              private magticomService: MagticomService,
              private splashScreen: SplashScreen,
              private storage: Storage) {
    this.initializeApp();
    this.checkCredentials();
  }

  initializeApp() {
      this.platform.ready().then(() => {
          this.splashScreen.hide();
      });
  }
  checkCredentials() {
      this.storage.get('magticom_credential')
          .then((response) => {
              if (response) {
                  this.router.navigate(['home']);
              } else {
                  this.router.navigate(['auth']);
              }
          })
          .catch(() => this.router.navigate(['auth']));
  }
}
