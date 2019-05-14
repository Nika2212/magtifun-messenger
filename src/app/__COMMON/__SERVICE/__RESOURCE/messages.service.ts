import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { MessageChainModel, MessageModel } from '../../__MODEL/message-chain.model';
import { ContactModel } from '../../__MODEL/contact.model';

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
        for (const message of receivedMessages) {
            const newContact = new ContactModel(null, null, null, null, message.address);
            const newMessage = new MessageModel(message._id, true, message.date, message.body);
            const foundContact = messages.filter(chain => chain.contact.formattedPhoneNumber === newContact.formattedPhoneNumber)[0];
            if (foundContact) {
                foundContact.messages.push(newMessage);
            } else {
                messages.push(new MessageChainModel(newContact, [newMessage]));
            }
        }
        for (const message of sentMessages) {
            const newContact = new ContactModel(null, null, null, null, message.address);
            const newMessage = new MessageModel(message._id, false, message.date, message.body);
            const foundContact = messages.filter(chain => chain.contact.formattedPhoneNumber === newContact.formattedPhoneNumber)[0];
            if (foundContact) {
                foundContact.messages.push(newMessage);
            } else {
                messages.push(new MessageChainModel(newContact, [newMessage]));
            }
        }
        for (const message of messages) {
            message.messages.sort((a, b) => {
                if (new Date(a.time) > new Date(b.time)) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
        if (contactList) {
            for (const message of messages) {
                for (const contact of contactList) {
                    if (message.contact.formattedPhoneNumber === contact.formattedPhoneNumber) {
                        message.contact.lastName = contact.lastName;
                        message.contact.firstName = contact.firstName;
                        message.contact.favorite = contact.favorite;
                        message.contact.id = contact.id;
                    }
                }
            }
        }
        return messages;
    }
}
