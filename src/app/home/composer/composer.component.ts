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

  constructor(private platform: Platform,
              private magticomService: MagticomService,
              private notificationService: UINotificationService) { }

  ngOnInit() {}
  ngAfterViewChecked(): void {
    try {
      this.contentReference.nativeElement.scrollTop = this.contentReference.nativeElement.scrollHeight;
    } catch (e) {
      // Nothing To Do Here
    }
  }

  public closeComposerMethod(): void {
    this.closeComposer.emit(false);
  }
  public sendMessage(): void {
    this.magticomService.send(this.composeMessageChain.recipient.formattedPhoneNumber, this.messageText, this.currentBalance)
        .then(() => {})
        .catch(errorCode => this.notificationService.setNotification(errorCode));
  }
}
