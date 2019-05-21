import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { RESOURCE } from '../../resource';
import {MessageChainModel} from '../../__COMMON/__MODEL/message-chain.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, AfterViewInit {
  @ViewChild('messageListReference') public messageListReference: ElementRef;
  @ViewChildren('messageArrayReference') public messageArrayReference: QueryList<ElementRef>;
  @Input() public sectionBodyHeight: number = null;
  @Input() public contentLoaded: boolean = false;
  @Input() public messagesArray: MessageChainModel[] = [];
  @Output() public contentLoadedEvent: EventEmitter<boolean> = new EventEmitter(true);

  public ASSETS = RESOURCE.ASSETS;

  constructor() { }

  public ngOnInit(): void {
    this.messageListReference.nativeElement.style.width = window.innerWidth + 'px';
    this.messageListReference.nativeElement.style.height = this.sectionBodyHeight + 'px';
  }
  public ngAfterViewInit(): void {
    this.messageArrayReference.changes.subscribe(() => this.contentLoadedEvent.emit(true));
  }
}
