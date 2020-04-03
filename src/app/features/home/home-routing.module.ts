import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Homepage1Component } from './homepage1/homepage1.component';
import { UploadPageComponent } from './upload/upload-page.component';
import { FindInventoryComponent } from './find-inventory/find-inventory.component';

const routes: Routes = [
  {
    path: 'homepage1',
     component: Homepage1Component,
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
    path: '',
    redirectTo: 'homepage1',
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
