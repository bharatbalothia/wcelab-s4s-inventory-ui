import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BucSvcAngularModule } from '@buc/svc-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {
  BucCommonClassesAllModuleClazz,
  BucCommShellStaticPatternIframeService,
  BucCommBEHttpInterceptorService,
  BucMultiTranslateHttpLoader
} from '@buc/svc-angular';

import { AppComponent } from './app.component';
import { ContentSwitcherModule } from 'carbon-components-angular';
import { BucCommonComponentsModule } from '@buc/common-components';

export class RapidInventoryAppModuleBundles {
  static bundles: Array<any> = [{
      prefix: './assets/rapid-inventory/i18n/',
      suffix: '.json'
  }];
}

export function rapidInventoryAppModuleHttpLoaderFactory(http: HttpClient) {
  return new BucMultiTranslateHttpLoader(http, RapidInventoryAppModuleBundles.bundles);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ContentSwitcherModule,
    BucSvcAngularModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
      provide: TranslateLoader,
          useFactory: rapidInventoryAppModuleHttpLoaderFactory,
          deps: [HttpClient]
      },
      isolate: true
    }),
    BucCommonComponentsModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BucCommBEHttpInterceptorService,
      multi: true
    }
    // Any other interceptor added by rapid-inventory to be added 2nd.
  ],
  bootstrap: [AppComponent]
})
export class AppModule extends BucCommonClassesAllModuleClazz {
  constructor(translateService: TranslateService,
              bucCommShellStaticPatternIframeService: BucCommShellStaticPatternIframeService) {
    super(translateService, bucCommShellStaticPatternIframeService);
  }
}
