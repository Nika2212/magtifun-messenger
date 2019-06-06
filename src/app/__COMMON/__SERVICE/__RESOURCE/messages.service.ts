import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { MessageChainModel, MessageModel, RecipientModel } from '../../__MODEL/message-chain.model';
import { ContactModel } from '../../__MODEL/contact.model';
import {Subject} from 'rxjs';

declare var SMS: any;

@Injectable({
    providedIn: 'root'
})

export class MessagesService {
    constructor(private androidPermissions: AndroidPermissions, private platform: Platform) {}

    public async messagesFetchMethod(contactList: ContactModel[] = null): Promise<MessageChainModel[]> {
        const READ_SMS = this.androidPermissions.PERMISSION.READ_SMS;
        const PERMISSION = await this.checkPermission(READ_SMS);
        if (!PERMISSION) {
            return null;
        }
        const inboxMessagesArray = await this.getInboxMessagesArray();
        const sentMessagesArray = await this.getSentMessagesArray();
        return this.convertToMessagesChain(inboxMessagesArray, sentMessagesArray, contactList);
    }

    private checkPermission(permissionString: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.androidPermissions.checkPermission(permissionString)
                .then(result => {
                    if (result.hasPermission) {
                        resolve(true);
                    } else {
                        this.getPermission(permissionString)
                            .then(() => resolve(true))
                            .catch(() => reject(false));
                    }
                })
                .catch(error => reject(false));
        });
    }
    private getPermission(permissionString: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.androidPermissions.requestPermissions([permissionString])
                .then(() => resolve(true))
                .catch(error => reject(false));
        });
    }
    private getInboxMessagesArray(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.platform.ready().then(() => {
                SMS.listSMS(
                    { box: "inbox", indexFrom: 0, maxCount: 1000000 },
                    messages => {
                        resolve(messages);
                    },
                    err => reject(err));
            });
        });
    }
    private getSentMessagesArray(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.platform.ready().then(() => {
                SMS.listSMS(
                    { box: "sent", indexFrom: 0, maxCount: 1000000 },
                    messages => {
                        resolve(messages);
                    },
                    err => reject(err));
            });
        });
    }
    private convertToMessagesChain(receivedMessages: any[], sentMessages: any[], contactList: ContactModel[]): MessageChainModel[] {
        const messages: MessageChainModel[] = [];
        console.log(receivedMessages);
        receivedMessages = receivedMessages.filter(message => message.address.length >= 9 && /^[0-9 ()+-]+$/.test(message.address));
        sentMessages = sentMessages.filter(message => message.address.length >= 9 && /^[0-9 ()+-]+$/.test(message.address));

        // tslint:disable-next-line:variable-name
        for (const _message of receivedMessages) {
            const recipient = new RecipientModel(_message.address);
            const message = new MessageModel(_message._id, true, _message.date, _message.body);
            const messageChain = messages.filter(rec => rec.recipient.formattedPhoneNumber === recipient.formattedPhoneNumber)[0];
            if (messageChain) {
                messageChain.messages.push(message);
            } else {
                messages.push(new MessageChainModel(recipient, [message]));
            }
        }
        // tslint:disable-next-line:variable-name
        for (const _message of sentMessages) {
            const recipient = new RecipientModel(_message.address);
            const message = new MessageModel(_message._id, false, _message.date, _message.body);
            const messageChain = messages.filter(rec => rec.recipient.formattedPhoneNumber === recipient.formattedPhoneNumber)[0];
            if (messageChain) {
                messageChain.messages.push(message);
            } else {
                messages.push(new MessageChainModel(recipient, [message]));
            }
        }
        // tslint:disable-next-line:variable-name
        for (const _message of messages) {
            const contact = contactList.filter(cnt => cnt.formattedPhoneNumber === _message.recipient.formattedPhoneNumber)[0];
            if (contact) {
                _message.recipient.decoratedFullName = contact.decoratedFullName;
            }
            _message.messages.sort((a, b) => {
                if (new Date(a.time) > new Date(b.time)) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }

        messages.sort((a, b ) => {
            if (new Date(a.messages[a.messages.length - 1].time) > new Date(b.messages[b.messages.length - 1].time)) {
                return -1;
            } else {
                return 1;
            }
        });
        return messages;
    }
}
