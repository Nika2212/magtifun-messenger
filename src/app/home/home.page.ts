import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { MessagesService } from '../__COMMON/__SERVICE/__RESOURCE/messages.service';
import { ContactModel } from '../__COMMON/__MODEL/contact.model';
import { ContactsService } from '../__COMMON/__SERVICE/__RESOURCE/contacts.service';
import { MessageChainModel } from '../__COMMON/__MODEL/message-chain.model';
import { RESOURCE } from '../resource';
import {Renderer3} from '@angular/core/src/render3/interfaces/renderer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('homeHeaderSearchInputReference') public homeHeaderSearchInputReference: ElementRef;
  @ViewChild('carouselRailReference') public carouselRailReference: ElementRef;

  public DEVICE_DISPLAY_WIDTH: number = null;
  public ASSETS = RESOURCE.ASSETS;
  public homeChildPagesArray: {id: string, name: string, iconActive: string, iconPassive: string}[] = [];
  public homeChildPageSelected: {id: string, name: string, iconActive: string, iconPassive: string};
  public homeClientContactsArray: ContactModel[] = [];
  public homeClientMessagesArray: MessageChainModel[] = [];
  public homeHeaderSearchMode: boolean = false;
  public homeHeaderSearchValue: string = '';
  public homeCarouselRailCoordinates: number[] = [];
  public homeContactListContentLoaded: boolean = false;
  public homeMessageListContentLoaded: boolean = false;
  public homeBodyHeight: number = null;

  constructor(private contactsService: ContactsService,
              private messagesService: MessagesService,
              private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.homeChildPagesArrayFillMethod();
    this.carouselRailConfigMethod();
    this.homeFetchResources().catch(() => {});
  }
  public homeChildPageSelectMethod(page: {id: string, name: string, iconActive: string, iconPassive: string}): void {
    const coordinates = this.homeCarouselRailCoordinates[this.homeChildPagesArray.indexOf(page)];
    this.renderer.setStyle(this.carouselRailReference.nativeElement, 'transform', `translate3d(${-coordinates}px, 0, 0)`);
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
  public homeContactListContentLoadMethod(event: boolean): void {
    this.homeContactListContentLoaded = true;
  }
  public homeMessageListContentLoadMethod(event: boolean): void {
    this.homeMessageListContentLoaded = true;
  }
  public homeOnInputBlur(): void {
    this.homeHeaderSearchMode = false;
    this.homeHeaderSearchValue = '';
  }
  private async homeFetchResources(): Promise<void> {
    this.homeClientContactsArray = await this.contactsService.contactsFetchMethod();
    this.homeClientMessagesArray = await this.messagesService.messagesFetchMethod(this.homeClientContactsArray);
  }
  private homeChildPagesArrayFillMethod(): void {
    this.homeChildPagesArray = [
      {id: '1', name: 'შეტყობინებები', iconActive: this.ASSETS.IMAGE.ICON.COMMENT_SELECTED, iconPassive: this.ASSETS.IMAGE.ICON.COMMENT},
      {id: '2', name: 'კონტაქტები', iconActive: this.ASSETS.IMAGE.ICON.CONTACTS_SELECTED, iconPassive: this.ASSETS.IMAGE.ICON.CONTACTS},
      {id: '3', name: 'პარამეტრები', iconActive: this.ASSETS.IMAGE.ICON.SETTINGS_SELECTED, iconPassive: this.ASSETS.IMAGE.ICON.SETTINGS}
    ];
    this.homeChildPageSelected = this.homeChildPagesArray[0];
  }
  private carouselRailConfigMethod(): void {
    this.DEVICE_DISPLAY_WIDTH = window.innerWidth;
    for (let i = 0; i < this.homeChildPagesArray.length; i++) {
      this.homeCarouselRailCoordinates.push(i * this.DEVICE_DISPLAY_WIDTH);
    }
    const initCoordinate = this.homeCarouselRailCoordinates[this.homeChildPagesArray.indexOf(this.homeChildPageSelected)];
    this.carouselRailReference.nativeElement.style.width = this.DEVICE_DISPLAY_WIDTH * this.homeChildPagesArray.length + 'px';
    this.carouselRailReference.nativeElement.style.transform = `translate3d(${-initCoordinate}px, 0, 0)`;
    this.homeBodyHeight = this.carouselRailReference.nativeElement.offsetHeight;
  }
}
