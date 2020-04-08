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
import {
    AvailabilityService,
    GetNetworkAvailabilityRequestLine,
    GetNodeAvailabilityProductBreakupRequest
} from '../rest-services/Availability.service';
import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';

@Injectable()
export class InventoryAvailabilityService {

    constructor(private availabilitySvc: AvailabilityService) {
    }

    public getInventoryForDG(
      items: string[],
      dgId: string,
      uoms: any[],
      productClass: any[]
    ) {
        const reqPayload = {
          deliveryMethod: 'SHP',
          unitOfMeasure: uoms[0],
          lineId: '1'
        };

        return this.availabilitySvc.postByTenantIdV1AvailabilityNetwork({
           $queryParameters: {  },
           tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
           body: reqPayload ,
           itemId: items[0],
           dgId
        });
    }

    public getConslidatedInventoryForDG(
      items: string[],
      dgIds: string[],
      uoms: any[],
      productClass: any[]
    ) {
      const lines = [];
       
    for(let idx=0; idx<dgIds.length; idx++){
      lines.push( 
        {
          "deliveryMethod":"SHP","distributionGroupId":dgIds[idx],"itemId":items[0],"lineId":idx,"unitOfMeasure":"UNIT"
        }
      );
    }
 
      const reqPayload = { "lines": lines }

      return this.availabilitySvc.postByTenantIdV1AvailabilityNetwork({
           $queryParameters: {  },
           tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
           body: reqPayload
         }).pipe( map(r => r) )
         .pipe(catchError((err) => observableOf([])));
    }

    

    private _buildGetNetworkAvailabilityRequestLine(method, dgId, itemId, uom, productClass) {
        const line: GetNetworkAvailabilityRequestLine = {
            deliveryMethod: method,
            distributionGroupId: dgId,
            itemId,
            lineId: itemId,
            // itemId,
            // lineId: productClass ? `${itemId}_${method}_${uom}_${productClass}` : `${itemId}_${method}_${uom}`,
            // productClass,
            unitOfMeasure: uom
        };
        return line;
    }

    public getInventoryForNodes(
      items: string[],
      nodes: string[],
      uoms: any[],
      productClass: any[]
    ) {
        const deliveryMethod = ['SHP'];

        const reqPayload = {
          deliveryMethod: 'SHP',
          itemId : items[0],
          unitOfMeasure: uoms[0],
          shipNodes: nodes
      };

        console.log('Request payload getInventoryForNodes', reqPayload);
        return this.availabilitySvc.postByTenantIdV1AvailabilityNode({
          $queryParameters: { },
          tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
          body: reqPayload,
          productId :  items[0]
        });
    }

    public getInventoryForNetwork(
      items: string[],
      nodes: string[],
      uoms: any[],
      productClass: any[]
    ) {
      /*  const deliveryMethod = ['SHP'];
        const reqPayload = {
          'deliveryMethod': 'SHP',
          'itemId' : items[0],
          'unitOfMeasure': uoms[0],
          'shipNodes': nodes
      };*/
      const reqPayload = {
        deliveryMethod: 'SHP',
        unitOfMeasure: uoms[0]
      };

      return this.availabilitySvc.postByTenantIdV1AvailabilityNetworkBySupplierAndProductId({
          $queryParameters: { },
          tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
          body: reqPayload,
          productId :  items[0],
          supplierId : nodes[0]
        });
    }

    public getInventoryBreakupForNodes(
      itemId: string,
      nodes: string[],
      uom: string,
      productClass: string
    ) {
          const reqPayload: GetNodeAvailabilityProductBreakupRequest = {
            deliveryMethod: 'SHP',
            productClass,
            unitOfMeasure: uom,
            shipNodes: nodes,
            demandType: undefined,
            segment: undefined,
            segmentType: undefined
          };

          return this.availabilitySvc.postByTenantIdV1AvailabilityNodeProductBreakup({
            $queryParameters: { },
            tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
            itemId,
            body: reqPayload
          });
    }

}
