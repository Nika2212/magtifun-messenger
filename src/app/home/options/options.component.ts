import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RESOURCE } from '../../resource';
import { MagticomService } from '../../__COMMON/__SERVICE/__API/magticom.service';
import { Router } from '@angular/router';
import { SettingsService } from '../../__COMMON/__SERVICE/__RESOURCE/settings.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  @Input() private sectionBodyHeight: number = null;
  @ViewChild('optionsReference') private optionsReference: ElementRef;

  public ASSETS = RESOURCE.ASSETS;
  public inPageProcessState: boolean = false;


  constructor(private magticomService: MagticomService,
              private router: Router,
              private settingsService: SettingsService ) { }

  public ngOnInit(): void {
    this.optionsReference.nativeElement.style.width = window.innerWidth + 'px';
    this.optionsReference.nativeElement.style.height = this.sectionBodyHeight + 'px';
  }
  public logout(): void {
    if (!this.inPageProcessState) {
      this.inPageProcessState = true;
      this.magticomService.magticomLogoutMethod().then(() => {
        this.router.navigate(['auth']);
        this.inPageProcessState = false;
      });
    }
  }
}
