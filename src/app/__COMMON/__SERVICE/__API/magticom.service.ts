import {Injectable} from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {RESOURCE} from '../../../resource';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class MagticomService {
    private API = RESOURCE.API;
    private csrfToken: string;
    private balance: Subject<string> = new Subject();

    constructor(private http: HTTP, private storage: Storage) {
        this.http.setDataSerializer('urlencoded');
    }

    public async magticomSend(phoneNumber: string, message: string): Promise<any> {
        const token = await this.storage.get('magticom_csrf_token');
        if (token) {
            const body = {
                recipients: phoneNumber,
                message_body: message,
                csrf_token: token
            };
            const response = await this.http.post(this.API.MAGTICOM.ROOT + this.API.MAGTICOM.SEND, body, {
                'Referer': 'http://www.magtifun.ge/index.php?page=2&lang=ge',
                'Cookie' : this.http.getCookieString(this.API.MAGTICOM.ROOT)
            });
            console.log(response);
            if (response.data === 'success') {
                return 200;
            } else {
                return 0;
            }
        } else {
            return -2;
        }
    }

    public login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.API.MAGTICOM.ROOT, null, null)
                .then((response: any) => {
                    const rawHTMLData = response.data;
                    const HTMLParser = new DOMParser();
                    const HTMLBody = HTMLParser.parseFromString(rawHTMLData, 'text/html');
                    try {
                        this.csrfToken = HTMLBody.querySelectorAll('input[name=csrf_token]')[0].getAttribute('value');
                        const body = { user : username, password, csrf_token : this.csrfToken };
                        const headers = { 'Content-Type': 'application/json', Connection: 'keep-alive' };
                        this.http.post(this.API.MAGTICOM.ROOT + this.API.MAGTICOM.LOGIN, body, headers)
                        // tslint:disable-next-line:variable-name
                            .then(_response => {
                                if (this.loginVerificationMethod(_response.data)) {
                                    const obj = {username, password};
                                    this.storage.set('magticom_credential', JSON.stringify(obj))
                                        .then(() => resolve(200));
                                } else {
                                    reject(403);
                                }
                            })
                            .catch(error => {
                                reject(0);
                            });
                    } catch (error) {
                        reject(409);
                    }
                })
                .catch((error) => {
                    reject(0);
                });
        });
    }
    public logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.clearCookies();
            this.csrfToken = null;
            this.storage.remove('magticom_credential').then(() => resolve());
        });
    }
    public getBalance(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.API.MAGTICOM.ROOT + this.API.MAGTICOM.CHECK, null, null)
                .then((response) => {
                    try {
                        console.log(response, '200');
                    } catch (e) {
                        console.log(response, 'Error');
                    }
                })
                .catch(() => reject(0));
        });
    }

    private loginVerificationMethod(responseData: string): boolean {
        const rawHTMLData = responseData;
        const HTMLParser = new DOMParser();
        return HTMLParser.parseFromString(rawHTMLData, 'text/html').querySelectorAll('input[name=act]')[0].getAttribute('value') === '2';
    }
}
