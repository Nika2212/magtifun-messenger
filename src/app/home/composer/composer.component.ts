import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { RESOURCE } from '../../resource';
import {MessageChainModel} from '../../__COMMON/__MODEL/message-chain.model';
import {Platform} from '@ionic/angular';
import {MagticomService} from '../../__COMMON/__SERVICE/__API/magticom.service';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.scss'],
})
export class ComposerComponent implements OnInit, AfterViewChecked {
  public ASSETS = RESOURCE.ASSETS;
  @ViewChild('contentReference') public contentReference: ElementRef;
  @Input() public composeMessageChain: MessageChainModel;
  @Input() public currentBalance: number = null;
  @Output() public closeComposer: EventEmitter<boolean> = new EventEmitter(false);

  public messageText: string = '';

  constructor(private platform: Platform, private magticomService: MagticomService) { }

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
    this.magticomService.magticomSend(this.composeMessageChain.recipient.formattedPhoneNumber, this.messageText);
  }
}
