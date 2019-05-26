import { Injectable } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Injectable({
    providedIn: 'root'
})

export class StatusBarService {
    constructor(private statusBar: StatusBar) {}

    public statusBarFillRedMethod(): void {
        try {
            this.statusBar.backgroundColorByHexString('#aa1b1b');
            this.statusBar.styleLightContent();
        } catch (e) {
            console.log('Status-Bar fill in red');
        }
    }
    public statusBarFillLightRedMethod(): void {
        try {
            this.statusBar.backgroundColorByHexString('#c62828');
            this.statusBar.styleLightContent();
        } catch (e) {
            console.log('Status-Bar fill in red');
        }
    }
    public statusBarFillBlackMethod(): void {
        try {
            this.statusBar.backgroundColorByHexString('#222');
            this.statusBar.styleLightContent();
        } catch (e) {
            console.log('Status-Bar fill in black');
        }
    }
}
