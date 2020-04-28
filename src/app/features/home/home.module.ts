import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { HomeRoutingModule } from './home-routing.module';

import { TranslateService } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {
  BucCommonClassesAllModuleClazz,
  BucMultiTranslateHttpLoader
} from '@buc/svc-angular';
import { BucCommonComponentsModule } from '@buc/common-components';

import { HomepageComponent } from './homepage/homepage.component';
import { UploadPageComponent } from './upload/upload-page.component';
import { FindInventoryComponent } from './find-inventory/find-inventory.component';
import { ItemSummaryComponent } from './find-inventory/item-summary/item-summary.component';
import { ItemDGAvailabilityComponent } from './find-inventory/item-dg-availability/item-dg-availability.component';
import { SupplierUploadPageComponent } from './supplierupload/supplier-upload-page.component';

import { BUCInvAvailabilityService } from './shared/rest-services/inventory-buc/Availability.service';
import { AvailabilityService } from './shared/rest-services/Availability.service';
import { DemandService } from './shared/rest-services/Demand.service';
import { ItemService } from './shared/rest-services/Item.service';
import { SafetyStockService } from './shared/rest-services/SafetyStock.service';
import { ShipNodeService } from './shared/rest-services/ShipNode.service';
import { StatisticalAvailabilityService } from './shared/rest-services/StatisticalAvailability.service';
import { SupplyService } from './shared/rest-services/Supply.service';
import { DistributionGroupService } from './shared/rest-services/DistributionGroup.service';

import { InventoryDistributionService } from './shared/services/inventory-distribution.service';
import { InventoryAvailabilityService } from './shared/services/inventory-availability.service';
import { InventoryDemandService } from './shared/services/inventory-demand.service';
import { InventorySupplyService } from './shared/services/inventory-supply.service';

import { S4SSearchService } from './shared/rest-services/S4SSearch.service';
import { HomeSharedModule } from './shared/home-shared.module';
import { Image32Module } from '@carbon/icons-angular/lib/image/32';
import { SupplierSearchComponent } from './supplier-search/supplier-search.component';
import { UploadDemandPageComponent } from './upload-demand/upload-demand-page.component';


const bundles: Array<any> = [
  {
    prefix: './assets/rapid-inventory/i18n/',
    suffix: '.json'
  },
  {
    prefix: './assets/rapid-inventory/i18n/home/homepage/',
    suffix: '.json'
  },
  {
    prefix: './assets/rapid-inventory/i18n/home/upload/',
    suffix: '.json'
  },
  {
    prefix: './assets/rapid-inventory/i18n/home/findinventory/',
    suffix: '.json'
  },
  {
    prefix: './assets/rapid-inventory/i18n/home/supplierupload/',
    suffix: '.json'
  },
  {
    prefix: './assets/rapid-inventory/i18n/home/supplier-search/',
    suffix: '.json'
  },
  {
    prefix: './assets/rapid-inventory/i18n/home/upload-demand/',
    suffix: '.json'
  }
];

@NgModule({
  declarations: [
    HomepageComponent,
    UploadPageComponent,
    FindInventoryComponent,
    ItemSummaryComponent,
    ItemDGAvailabilityComponent,
    SupplierUploadPageComponent,
    SupplierSearchComponent,
    UploadDemandPageComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BucCommonComponentsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (h: HttpClient) => new BucMultiTranslateHttpLoader(h, bundles),
        deps: [HttpClient]
      },
      isolate: true
    }),
    Image32Module,
    HomeSharedModule,
    HomeRoutingModule
  ],
  providers: [
    BUCInvAvailabilityService,
    AvailabilityService,
    DemandService,
    ItemService,
    SafetyStockService,
    ShipNodeService,
    StatisticalAvailabilityService,
    SupplyService,
    DistributionGroupService,

    S4SSearchService,
    InventoryDistributionService,
    InventoryAvailabilityService,
    InventoryDemandService,
    InventorySupplyService
  ],
})
export class HomeModule extends BucCommonClassesAllModuleClazz {
  constructor(translateService: TranslateService) {
    super(translateService);
  }
}
