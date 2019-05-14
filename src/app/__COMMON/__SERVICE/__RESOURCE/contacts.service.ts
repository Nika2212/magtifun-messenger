import { Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts/ngx';
import { ContactModel } from '../../__MODEL/contact.model';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})

export class ContactsService {
    constructor(private contacts: Contacts, private storage: Storage) {}

    public async contactsFetchMethod(): Promise<ContactModel[]> {
        const rawContactsArray = await this.contacts.find(['*']);
        const favoriteContactsIdArray: string[] = JSON.parse(await this.storage.get('favorite_contacts'));
        const contactsArray: ContactModel[] = [];
        for (const contact of rawContactsArray) {
            const newContact = new ContactModel(
                contact.id,
                contact.name.givenName,
                contact.name.familyName,
                false,
                contact.phoneNumbers[0].value
            );
            if (favoriteContactsIdArray && favoriteContactsIdArray.filter(id => contact.id === id)[0]) {
                newContact.favorite = true;
            }
            contactsArray.push(newContact);
        }
        contactsArray.sort((a, b) => {
            if (a.firstName < b.firstName) {
                return -1;
            } else {
                return 1;
            }
        });
        return contactsArray;
    }
}
