import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { RESOURCE } from '../../resource';
import {MessageChainModel, MessageModel} from '../../__COMMON/__MODEL/message-chain.model';
import {Platform} from '@ionic/angular';
import {MagticomService} from '../../__COMMON/__SERVICE/__API/magticom.service';
import {UINotificationService} from '../../__COMMON/__COMPONENT/ui-notification/ui-notification.service';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.scss'],
})
export class ComposerComponent implements OnInit, AfterViewChecked {
  @ViewChild('contentReference') public contentReference: ElementRef;
  @Input() public composeMessageChain: MessageChainModel;
  @Input() public currentBalance: number = null;
  @Output() public closeComposer: EventEmitter<boolean> = new EventEmitter(false);

  public ASSETS = RESOURCE.ASSETS;
  public messageText: string = '';
  public renderedMessagesArray: MessageModel[] = [];

  constructor(private platform: Platform,
              private magticomService: MagticomService,
              private notificationService: UINotificationService) { }

  ngOnInit() {

  }
  ngAfterViewChecked(): void {}

  public closeComposerMethod(): void {
    this.closeComposer.emit(false);
  }
  public sendMessage(): void {
    this.magticomService.send(this.composeMessageChain.recipient.formattedPhoneNumber, this.messageText, this.currentBalance)
        .then(() => {})
        .catch(errorCode => this.notificationService.setNotification(errorCode));
  }
  public loadMessages(): void {
    const startIndex = this.renderedMessagesArray ? this.composeMessageChain.messages
        .indexOf(this.renderedMessagesArray[this.renderedMessagesArray.length - 1]) : this.composeMessageChain.messages.length - 1;
    const endIndex = this.composeMessageChain.messages[startIndex - 50] ?
        startIndex - 50 : 0;
    for (let i = startIndex; i >= endIndex; i--) {
      this.renderedMessagesArray.push(this.composeMessageChain.messages[i]);
    }
  }
}
