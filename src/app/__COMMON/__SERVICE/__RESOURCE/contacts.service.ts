import { Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts/ngx';
import { ContactModel } from '../../__MODEL/contact.model';
import { Storage } from '@ionic/storage';
import * as faker from 'faker';

@Injectable({
    providedIn: 'root'
})

export class ContactsService {
    constructor(private contacts: Contacts, private storage: Storage) {}

    public async contactsFetchMethod(): Promise<ContactModel[]> {
        try {
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
        } catch (error) {
            return this.getFakeContacts(30);
        }
    }
    public async contactsSetFavoriteMethod(id: string): Promise<void> {
        let favoriteList = await this.storage.get('favorite_contacts');
        if (!favoriteList) {
            favoriteList = [];
        } else {
            favoriteList = JSON.parse(favoriteList);
        }
        favoriteList.push(id);
        await this.storage.set('favorite_contacts', JSON.stringify(favoriteList));
    }
    public async contactsRemoveFavoriteMethod(id: string): Promise<void> {
        let favoriteList = await this.storage.get('favorite_contacts');
        favoriteList = JSON.parse(favoriteList);
        favoriteList.splice(favoriteList.indexOf(id), 1);
        await this.storage.set('favorite_contacts', JSON.stringify(favoriteList));
    }

    private getFakeContacts(quantity: number): ContactModel[] {
        const contactArray: ContactModel[] = [];

        for (let i = 0; i < quantity; i++) {
            const newContact = new ContactModel(
                (Math.floor(Math.random() * 9999)).toString(),
                faker.name.firstName(),
                faker.name.lastName(),
                false,
                (Math.floor(Math.random() * 599999999) + 551000000).toString()
            );
            contactArray.push(newContact);
        }

        return contactArray;
    }
}
