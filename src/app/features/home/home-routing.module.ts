import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { UploadPageComponent } from './upload/upload-page.component';
import { FindInventoryComponent } from './find-inventory/find-inventory.component';
import { SupplierUploadPageComponent } from './supplierupload/supplier-upload-page.component';
import { SupplierSearchComponent } from './supplier-search/supplier-search.component';
import { UploadDemandPageComponent } from './upload-demand/upload-demand-page.component';

const routes: Routes = [
  {
    path: 'homepage',
    component: HomepageComponent,
  },
  {
    path: 'supplier-search',
    component: SupplierSearchComponent,
  },
  {
    path: 'upload',
    component: UploadPageComponent,
  },
  {
    path: 'itemsearch',
    component: FindInventoryComponent,
  },
  {
    path: 'supplierupload',
    component: SupplierUploadPageComponent,
  },
  {
    path: 'uploaddemand',
    component: UploadDemandPageComponent,
  },
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full'
  }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    providers: []
})
export class HomeRoutingModule { }
