import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MessagesService } from '../__COMMON/__SERVICE/__RESOURCE/messages.service';
import { ContactModel } from '../__COMMON/__MODEL/contact.model';
import { ContactsService } from '../__COMMON/__SERVICE/__RESOURCE/contacts.service';
import { MessageChainModel } from '../__COMMON/__MODEL/message-chain.model';
import { RESOURCE } from '../resource';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('homeHeaderSearchInputReference') public homeHeaderSearchInputReference: ElementRef;
  @ViewChild('carouselRailReference') public carouselRailReference: ElementRef;

  public ASSETS = RESOURCE.ASSETS;
  public homeChildPagesArray: {id: string, name: string, iconActive: string, iconPassive: string}[] = [];
  public homeChildPageSelected: {id: string, name: string, iconActive: string, iconPassive: string};
  public homeClientContactsArray: ContactModel[] = [];
  public homeClientFavoriteContactsArray: ContactModel[] = [];
  public homeClientMessagesArray: MessageChainModel[] = [];
  public homeHeaderSearchMode: boolean = false;
  public homeHeaderSearchValue: string = '';

  constructor(private contactsService: ContactsService, private messagesService: MessagesService) {}

  public ngOnInit(): void {
    this.homeChildPagesArrayFillMethod();
    this.homeFetchResources();
  }
  public homeChildPageSelectMethod(page: {id: string, name: string, iconActive: string, iconPassive: string}): void {
    this.homeChildPageSelected = page;
  }
  public homeHeaderSearchModeToggleMethod(): void {
    if (!this.homeHeaderSearchMode) {
      this.homeHeaderSearchMode = true;
      setTimeout(() => this.homeHeaderSearchInputReference.nativeElement.focus(), 50);
    } else {
      this.homeHeaderSearchInputReference.nativeElement.blur();
      this.homeHeaderSearchMode = false;
    }
  }
  private async homeFetchResources(): Promise<void> {
    this.homeClientContactsArray = await this.contactsService.contactsFetchMethod();
    this.homeClientFavoriteContactsArray = this.homeClientContactsArray.filter(contact => contact.favorite);
    this.homeClientMessagesArray = await this.messagesService.messagesFetchMethod(this.homeClientContactsArray);
  }
  private homeChildPagesArrayFillMethod(): void {
    this.homeChildPagesArray = [
      {id: '1', name: 'შეტყობინებები', iconActive: this.ASSETS.IMAGE.ICON.COMMENT_SELECTED, iconPassive: this.ASSETS.IMAGE.ICON.COMMENT},
      {id: '2', name: 'კონტაქტები', iconActive: this.ASSETS.IMAGE.ICON.CONTACTS_SELECTED, iconPassive: this.ASSETS.IMAGE.ICON.CONTACTS},
      {id: '3', name: 'პარამეტრები', iconActive: this.ASSETS.IMAGE.ICON.SETTINGS_SELECTED, iconPassive: this.ASSETS.IMAGE.ICON.SETTINGS}
    ];
    this.homeChildPageSelected = this.homeChildPagesArray[1];
  }
}
