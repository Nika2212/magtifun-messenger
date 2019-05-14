import { ContactModel } from './contact.model';

export class MessageChainModel {
    constructor(public contact: ContactModel, public messages: MessageModel[]) {}
}
export class MessageModel {
    constructor(public id: string, public inbox: boolean, public time: string, public body: string) {}
}
