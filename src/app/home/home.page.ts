import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MessagesService } from '../__COMMON/__SERVICE/__RESOURCE/messages.service';
import { ContactModel } from '../__COMMON/__MODEL/contact.model';
import { ContactsService } from '../__COMMON/__SERVICE/__RESOURCE/contacts.service';
import { MessageChainModel, MessagePreviewModel, RecipientModel } from '../__COMMON/__MODEL/message-chain.model';
import { RESOURCE } from '../resource';
import { StatusBarService } from '../__COMMON/__SERVICE/__NATIVE/status-bar.service';
import { MagticomService} from '../__COMMON/__SERVICE/__API/magticom.service';
import { UINotificationService } from '../__COMMON/__COMPONENT/ui-notification/ui-notification.service';
import { homeComposerAnimation } from './home.animation';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    animations: homeComposerAnimation
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
    public homeClientPreviewMessagesArray: MessagePreviewModel[] = [];
    public homeHeaderSearchMode: boolean = false;
    public homeHeaderSearchValue: string = '';
    public homeCarouselRailCoordinates: number[] = [];
    public homeContactListContentLoaded: boolean = false;
    public homeMessageListContentLoaded: boolean = false;
    public homeBodyHeight: number = null;
    public composeMessageChain: MessageChainModel;
    public composeMode: boolean = false;
    public currentBalance: number = null;

    constructor(private contactsService: ContactsService,
                private messagesService: MessagesService,
                private renderer: Renderer2,
                private magticomService: MagticomService,
                private statusBarService: StatusBarService,
                private notificationService: UINotificationService) {}

    public ngOnInit(): void {
        this.statusBarService.statusBarFillLightRedMethod();
        this.homeChildPagesArrayFillMethod();
        this.carouselRailConfigMethod();
        this.homeFetchResources().catch(() => {});
        this.magticomService.getBalance();
    }
    public ionViewWillEnter() {
        this.statusBarService.statusBarFillLightRedMethod();
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
    public onContactSelect(contact: ContactModel): void {
        const chain = this.homeClientMessagesArray.filter(message => message.recipient.formattedPhoneNumber === contact.formattedPhoneNumber)[0];
        if (chain) {
            this.composeMessageChain = chain;
        } else {
            this.composeMessageChain = new MessageChainModel(new RecipientModel(contact.formattedPhoneNumber), null);
            this.composeMessageChain.recipient.decoratedFullName = contact.decoratedFullName;
        }
        this.composeTrigger(true);
    }
    public onChainSelect(chain: MessagePreviewModel): void {
        this.composeMessageChain = this.homeClientMessagesArray.filter(message => message.recipient.formattedPhoneNumber === chain.formattedPhoneNumber)[0];
        if (!this.composeMessageChain) {
            this.notificationService.setNotification(-1);
            return;
        }
        this.composeTrigger(true);
    }
    public composeTrigger(state: boolean): void {
        this.composeMode = state;
    }
    private async homeFetchResources(): Promise<void> {
        const previewMessage: MessagePreviewModel[] = [];
        this.homeClientContactsArray = await this.contactsService.contactsFetchMethod();
        this.homeClientMessagesArray = await this.messagesService.messagesFetchMethod(this.homeClientContactsArray);
        for (const message of this.homeClientMessagesArray) {
            const newMessage = new MessagePreviewModel(
                message.recipient.formattedPhoneNumber,
                message.recipient.decoratedPhoneNumber,
                message.recipient.decoratedFullName,
                message.messages[message.messages.length - 1].body,
                message.messages[message.messages.length - 1].time
            );
            previewMessage.push(newMessage);
        }
        this.homeClientPreviewMessagesArray = previewMessage;
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
