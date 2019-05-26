import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.checkToken();
    });
  }
  checkToken() {
    this.storage.get('magticom_csrf_token')
        .then(token => {
          if (token) {
            this.router.navigate(['home']);
          } else {
            this.router.navigate(['auth']);
          }
        })
        .catch(() => this.router.navigate(['auth']));
  }
}
