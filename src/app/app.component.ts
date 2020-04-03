import { Component, OnInit } from '@angular/core';
import {
  BucCommonClassesAppComponentClazz,
  BucSvcAngularStaticAppInfoFacadeUtil
} from '@buc/svc-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BucCommonClassesAppComponentClazz implements OnInit {

  // Obtained from superclass: isBucTenantChangeSuccess, isBucJwtRefreshSuccess, isInitialState

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  handleBucTenantChange(msg) {
    BucSvcAngularStaticAppInfoFacadeUtil.log('AppComponent', 'handleBucTenantChange',
        'isBucTenantChangeSuccess$ published with value as "true", tenant details available',
        BucSvcAngularStaticAppInfoFacadeUtil.getTenantDetails());
  }

  handleBucTenantChangeFailure(errorObj) {
    BucSvcAngularStaticAppInfoFacadeUtil.error('AppComponent', 'handleBucTenantChangeFailure', 'bucTenantChangeFailure$.', errorObj);
  }

  handleBucJwtRefresh(msg) {
    BucSvcAngularStaticAppInfoFacadeUtil.log('AppComponent', 'handleBucJwtRefresh',
        'isBucJwtRefreshSuccess$ published with value as "true". The interceptor/wrapper should handle this. Shell JWT: ',
        BucSvcAngularStaticAppInfoFacadeUtil.getShellJWT(), ' \n BUC JWT: ', BucSvcAngularStaticAppInfoFacadeUtil.getBucJwt());
  }

  handleBucJwtRefreshFailure(errorObj) {
    BucSvcAngularStaticAppInfoFacadeUtil.error('AppComponent', 'handleBucJwtRefreshFailure', 'bucJwtRefreshFailure$.', errorObj);
  }
}
