import {Injectable} from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';
import {Storage} from '@ionic/storage';
import {RESOURCE} from '../../../resource';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class MagticomService {
    private API = RESOURCE.API;
    private csrfToken: string;
    private reserveCookieString: string;
    private balance: Subject<number> = new Subject();

    constructor(private http: HTTP, private storage: Storage) {
        this.http.setDataSerializer('urlencoded');
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
                        const body = { user : username, password, csrf_token : this.csrfToken, remember: 'on' };
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
    public update(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.API.MAGTICOM.ROOT + this.API.MAGTICOM.CHECK, null, null)
                .then((response) => {
                    try {
                        this.csrfToken = new DOMParser().parseFromString(response.data, 'text/html').querySelectorAll('input[name=csrf_token]')[0].getAttribute('value');
                        this.reserveCookieString = this.http.getCookieString(this.API.MAGTICOM.ROOT);
                        // tslint:disable-next-line:radix
                        this.balance.next(parseInt(new DOMParser().parseFromString(response.data, 'text/html').querySelectorAll('.xxlarge')[0].innerHTML));
                        resolve(200);
                    } catch (e) {
                        this.storage.get('magticom_credential')
                            .then((credential) => {
                                if (credential) {
                                    const cred = JSON.parse(credential);
                                    this.login(cred.username, cred.password)
                                        .then(() => this.update().then(() => resolve()).catch(() => reject(-1)))
                                        .catch(() => reject(-2));
                                } else {
                                    console.log('Breakpoint');
                                    reject(-2);
                                }
                            });
                    }
                })
                .catch(() => reject(0));
        });
    }
    public send(phoneNumber: string, message: string, currentBalance: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.update()
                .then(() => {
                    const body = {
                        recipients: phoneNumber,
                        message_body: message,
                        csrf_token: this.csrfToken
                    };
                    this.http.post(this.API.MAGTICOM.ROOT + this.API.MAGTICOM.SEND, body, {
                        'Connection' : 'Keep-Alive',
                        'Referer': 'http://www.magtifun.ge/index.php?page=2&lang=ge',
                        'Cookie' : this.reserveCookieString ? this.reserveCookieString : this.http.getCookieString(this.API.MAGTICOM.ROOT + this.API.MAGTICOM.CHECK)
                    })
                        .then(response => {
                            if (response.data === 'success') {
                                this.balance.next(currentBalance - 1);
                                resolve(200);
                            } else {
                                console.log(response, 'In Response');
                                reject(-1);
                            }
                        })
                        .catch(errorCode => {
                            console.log(errorCode, 'POST Catch');
                            reject(errorCode);
                        });
                })
                .catch(errorCode => reject(errorCode));
        });
    }
    public getBalance(): Observable<number> {
        return this.balance;
    }

    private loginVerificationMethod(responseData: string): boolean {
        const rawHTMLData = responseData;
        const HTMLParser = new DOMParser();
        return HTMLParser.parseFromString(rawHTMLData, 'text/html').querySelectorAll('input[name=act]')[0].getAttribute('value') === '2';
    }
}
