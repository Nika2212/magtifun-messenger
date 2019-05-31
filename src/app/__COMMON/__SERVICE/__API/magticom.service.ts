import {Injectable} from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {RESOURCE} from '../../../resource';

@Injectable({
    providedIn: 'root'
})

export class MagticomService {
    private API = RESOURCE.API;
    private csrfToken: string;

    constructor(private http: HTTP, private storage: Storage) {
        this.http.setDataSerializer('urlencoded');
    }

    public async magticomLoginMethod(username: string, password: string): Promise<number> {
        if (await this.clearDataMethod()) {
            const magticomSession = await this.fetchSessionMethod();
            if (magticomSession === 200) {
                const magticomLoginRequest = await this.loginRequestMethod(username, password);
                if (magticomLoginRequest === 200) {
                    const magticomToken = await this.saveSessionTokenMethod();
                    if (magticomToken) {
                        return 200;
                    } else {
                        // Storage Error
                        return -1;
                    }
                } else if (magticomLoginRequest === 403) {
                    // Invalid User/Password
                    return 403;
                } else if (magticomLoginRequest === 0) {
                    // Connection Error
                    return 0;
                }
            } else if (magticomSession === 409) {
                // API Error
                return 409;
            } else if (magticomSession === 0) {
                // Connection Error
                return 0;
            }
        } else {
            // Storage Error
            return -1;
        }
    }
    public async magticomLogoutMethod(): Promise<number> {
        return await this.clearDataMethod() ? 200 : -1;
    }
    public async magticomGetBalance(): Promise<any> {
        const response = await this.http.get(this.API.MAGTICOM.ROOT + this.API.MAGTICOM.CHECK, null, null);
        return new DOMParser().parseFromString(response.data, 'text/html').getElementsByClassName('xxlarge')[0].innerHTML;
    }

    private clearDataMethod(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.clearCookies();
            this.csrfToken = null;
            this.storage.remove('magticom_csrf_token')
                .then(() => resolve(true))
                .catch(error => {
                    console.log(error);
                    reject(false);
                });
        });
    }
    private fetchSessionMethod(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.http.get(this.API.MAGTICOM.ROOT, null, null)
                .then((response: any) => {
                    const rawHTMLData = response.data;
                    const HTMLParser = new DOMParser();
                    const HTMLBody = HTMLParser.parseFromString(rawHTMLData, 'text/html');
                    try {
                        this.csrfToken = HTMLBody.querySelectorAll('input[name=csrf_token]')[0].getAttribute('value');
                        resolve(200);
                    } catch (error) {
                        console.log(error);
                        reject(409);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(0);
                });
        });
    }
    private loginRequestMethod(username: string, password: string): Promise<number> {
        return new Promise((resolve, reject) => {
            const body = { user : username, password, csrf_token : this.csrfToken };
            const headers = { 'Content-Type': 'application/json', Connection: 'keep-alive' };
            this.http.post(this.API.MAGTICOM.ROOT + this.API.MAGTICOM.LOGIN, body, headers)
                .then(response => {
                    if (this.loginVerificationMethod(response.data)) {
                        resolve(200);
                    } else {
                        reject(403);
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(0);
                });
        });
    }
    private loginVerificationMethod(responseData: string): boolean {
        const rawHTMLData = responseData;
        const HTMLParser = new DOMParser();
        return HTMLParser.parseFromString(rawHTMLData, 'text/html').querySelectorAll('input[name=act]')[0].getAttribute('value') === '2';
    }
    private saveSessionTokenMethod(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.storage.set('magticom_csrf_token', this.csrfToken)
                .then(() => resolve(true))
                .catch(() => reject(false));
        });
    }
}
