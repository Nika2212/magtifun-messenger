import { ContactModel } from './contact.model';

export class MessageModel {
    constructor(public interlocutor: ContactModel, messages: any[]) {}
}
