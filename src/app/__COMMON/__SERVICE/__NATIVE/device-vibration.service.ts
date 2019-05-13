import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Injectable({
    providedIn: 'root'
})

export class DeviceVibrationService {
    constructor(private vibration: Vibration) {}

    public deviceVibrationErrorMethod(): void {
        this.vibration.vibrate(120);
    }
    public deviceVibrationSetFavoriteMethod(): void {
        this.vibration.vibrate([20, 80, 20]);
    }
    public deviceVibrationRemoveFavoriteMethod(): void {
        this.vibration.vibrate(20);
    }
}
