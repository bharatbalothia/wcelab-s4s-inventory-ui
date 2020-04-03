import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ItemDGAvailabilityComponent } from './item-dg-availability/item-dg-availability.component';

@Component({
    selector: 'app-find-inventory',
    templateUrl: './find-inventory.component.html',
    styleUrls: ['./find-inventory.component.scss'],
  })
export class FindInventoryComponent implements OnInit {
  @HostBinding('class') page = 'page-component';
  @ViewChild(ItemDGAvailabilityComponent, {static: false}) itemDGAvail: ItemDGAvailabilityComponent;
  public itemId: string;

  private readonly nlsMap: any = {
    'FINDINVENTORY.SEARCHFOR': '',
    'FINDINVENTORY.COUNTY': '',
    'FINDINVENTORY.NAME': '',
    'FINDINVENTORY.AVAILABLE': '',
    'FINDINVENTORY.REGION': ''
  };

  constructor(
    private translateSvc: TranslateService
  ) {
  }

    ngOnInit() {
      this._init();
    }

    private async _init() {
      await this._initTranslations();
    }

    private async _initTranslations() {
      const keys = Object.keys(this.nlsMap);
      const json = await this.translateSvc.get(keys).toPromise();
      keys.forEach(k => this.nlsMap[k] = json[k]);
    }

    public findInventory() {
      if (this.itemId) {
        this.itemDGAvail.getAvailability([this.itemId]);
      }
    }
}
