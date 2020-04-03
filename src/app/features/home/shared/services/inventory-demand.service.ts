// -----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// 5737-D18
//
// (C) Copyright IBM Corp. 2018, 2019 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
// -----------------------------------------------------------------

import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DemandService } from '../rest-services/Demand.service';
import { BucCommOmsRestAPIService, BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';

@Injectable()
export class InventoryDemandService {
  constructor(private demandSvc: DemandService, private restApiSvc: BucCommOmsRestAPIService) { }

  public getDemandByAllTypes(skuId, skuNode, orgCode?, uom?, pClass?) {
    return this.demandSvc.getByTenantIdV1Demands({
      itemId: skuId,
      unitOfMeasure: uom,
      productClass: pClass ? pClass : '',
      shipNode: skuNode,
      tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId()
    })
      .pipe(
        catchError((err) => observableOf([]))
      );
  }

}
