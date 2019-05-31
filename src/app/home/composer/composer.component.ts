import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { RESOURCE } from '../../resource';
import {MessageChainModel} from '../../__COMMON/__MODEL/message-chain.model';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.scss'],
})
export class ComposerComponent implements OnInit {
  public ASSETS = RESOURCE.ASSETS;
  @Input() public composeMessageChain: MessageChainModel;
  @Input() public currentBalance: number = null;
  @Output() public closeComposer: EventEmitter<boolean> = new EventEmitter(false);

  constructor(private platform: Platform) { }

  ngOnInit() {
    // this.platform.backButton.subscribeWithPriority(1, () => this.closeComposerMethod());
  }
  public closeComposerMethod(): void {
    this.closeComposer.emit(false);
  }
}
