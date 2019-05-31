import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList, Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ContactModel } from '../../__COMMON/__MODEL/contact.model';
import { ContactsService } from '../../__COMMON/__SERVICE/__RESOURCE/contacts.service';
import { contactListAnimation } from './contact-list.animation';
import { DeviceVibrationService } from '../../__COMMON/__SERVICE/__NATIVE/device-vibration.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: contactListAnimation
})
export class ContactListComponent implements OnInit, AfterViewInit {
  @ViewChild('contactListReference') public contactListReference: ElementRef;
  @ViewChild('favoriteContactWrapper') public favoriteContactWrapper: ElementRef;
  @ViewChildren('contactsArrayReference') public contactsArrayReference: QueryList<any>;
  @Input() public sectionBodyHeight: number = null;
  @Input() public set setContactsArray(contacts: ContactModel[]) {
    this.contactsArray = contacts;
    this.favoriteContactsArray = this.contactsArray.filter(contact => contact.favorite);
  }
  @Input() public contentLoaded: boolean = false;
  @Input() public searchMode: boolean = false;
  @Input() public set setSearchValue(value: string) {
    if (value !== '' && this.searchMode) {
      this.searchedContactsArray = [];
      for (const contact of this.contactsArray) {
        if (contact.formattedPhoneNumber.search(value) > -1 || contact.decoratedFullName.toLowerCase().search(value.toLowerCase()) > -1) {
          this.searchedContactsArray.push(contact);
        }
      }
    } else {
      this.searchedContactsArray = [];
    }
  }
  @Output() public contentLoadedEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public selectedContactEvent: EventEmitter<ContactModel> = new EventEmitter(true);

  public contactsArray: ContactModel[] = [];
  public favoriteContactsArray: ContactModel[] = [];
  public searchedContactsArray: ContactModel[] = [];

  constructor(private contactsService: ContactsService,
              private renderer: Renderer2,
              private vibrationService: DeviceVibrationService) { }

  public ngOnInit(): void {
    this.contactListReference.nativeElement.style.width = window.innerWidth + 'px';
    this.contactListReference.nativeElement.style.height = this.sectionBodyHeight + 'px';
  }
  public ngAfterViewInit(): void {
    this.contactsArrayReference.changes.subscribe(() => {
      this.contentLoadedEvent.emit(true);
    });
  }
  public ngForPerformance(index, item): any {
    if (!item) {
      return null;
    }
    return item.id;
  }
  public toggleFavoriteContact(contact: ContactModel): void {
    if (!contact.favorite) {
      contact.favorite = true;
      this.favoriteContactsArray.push(contact);
      this.vibrationService.deviceVibrationSetFavoriteMethod();
      this.contactsService.contactsSetFavoriteMethod(contact.id);
    } else {
      contact.favorite = false;
      this.favoriteContactsArray.splice(this.favoriteContactsArray.indexOf(contact), 1);
      this.vibrationService.deviceVibrationRemoveFavoriteMethod();
      this.contactsService.contactsRemoveFavoriteMethod(contact.id);
    }
  }
  public selectContactMethod(contact: ContactModel): void {
    this.selectedContactEvent.emit(contact);
  }
}
