import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList, SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { RESOURCE } from '../../resource';
import {MessageChainModel, MessagePreviewModel} from '../../__COMMON/__MODEL/message-chain.model';
import {allResolved} from 'q';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, AfterViewInit {
  @ViewChild('messageListReference') public messageListReference: ElementRef;
  @ViewChild('messageListContainerReference') public messageListContainerReference: ElementRef;
  @ViewChildren('messageArrayReference') public messageArrayReference: QueryList<ElementRef>;
  @Input() public sectionBodyHeight: number = null;
  @Input() public contentLoaded: boolean = false;
  @Input() public messagesArray: MessagePreviewModel[] = [];
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
