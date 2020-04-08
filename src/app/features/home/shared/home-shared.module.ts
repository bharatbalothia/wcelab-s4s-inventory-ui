import { BucIconsModule, BucCommonComponentsModule } from '@buc/common-components';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BucMultiTranslateHttpLoader } from '@buc/svc-angular';
import { NgModule } from '@angular/core';

export class HomeSharedNlsBundlesModule {
  static bundles: Array<any> = [
    {
      prefix: './assets/buc-app-inventory/i18n/',
      suffix: '.json'
    }
  ];
}

export function homeSharedNlsHttpLoaderFactory(http: HttpClient) {
  return new BucMultiTranslateHttpLoader(http, HomeSharedNlsBundlesModule.bundles);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BucCommonComponentsModule,
    BucIconsModule,
    RouterModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: homeSharedNlsHttpLoaderFactory,
        deps: [ HttpClient ]
      },
      isolate: true
    })
  ],
  declarations: [
    InfoModalComponent
  ],
  exports: [
    // components
    InfoModalComponent,

    // modules
    BucCommonComponentsModule,
    BucIconsModule
  ],
  providers: [
  ],
  entryComponents: [
    InfoModalComponent
  ]
})
export class HomeSharedModule {}
