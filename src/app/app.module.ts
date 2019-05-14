import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP } from '@ionic-native/http/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration/ngx';
import { UiNotificationModule } from './__COMMON/__COMPONENT/ui-notification/ui-notification.module';
import { UISvgModule } from './__COMMON/__COMPONENT/ui-svg/ui-svg.module';
import { Contacts } from '@ionic-native/contacts/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, FormsModule, UiNotificationModule, UISvgModule, IonicStorageModule.forRoot(), IonicModule.forRoot(), AppRoutingModule],
  providers: [
    HTTP,
    AndroidPermissions,
    Contacts,
    Vibration,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
