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
import { catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

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

    /**
     * @see getConsolidatedInventorySameUOMSamePC
     */
    public getConslidatedInventoryForDG(
      items: string[],
      dgIds: string[],
      uoms: any[],
      productClass: any[]
    ) {
      const lines = [];

      dgIds.forEach((dgId, idx) => {
        lines.push(
          {
            deliveryMethod: 'SHP',
            distributionGroupId: dgId,
            itemId: items[0],
            lineId: idx,
            unitOfMeasure: 'UNIT'
          }
        );
      });

      const reqPayload = { lines };
      return this.availabilitySvc.postByTenantIdV1AvailabilityNetwork({
        $queryParameters: {},
        tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
        body: reqPayload
      })
      .pipe(catchError((err) => observableOf([])));
    }

    /**
     * @see getInventoryForSkuAtNodes
     */
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

    /**
     * @see getInventoryForItemBySupplier
     */
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


    /**
     * fetches inventory for item at various suppliers by given UOM and PC
     * @param item item-id
     * @param suppliers array of supplier-ids
     * @param unitOfMeasure unit-of-measure
     * @param productClass product-class
     */
    public getConsolidatedInventorySameUOMSamePC(
      item: string,
      suppliers: string[],
      unitOfMeasure: string,
      productClass: string
    ) {
      const lines = suppliers.map((supplier, idx) => ({
        deliveryMethod: 'SHP',
        distributionGroupId: supplier,
        itemId: item,
        lineId: idx,
        unitOfMeasure,
        productClass
      }));

      return this.availabilitySvc.postByTenantIdV1AvailabilityNetwork({
        $queryParameters: {},
        tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
        body: { lines }
      })
      .pipe(catchError((err) => observableOf([])));
    }

    /**
     * fetches inventory for item (its SKUs) at given supplier by given UOM and PC
     * @param productId item-id
     * @param supplierId supplier-id
     * @param unitOfMeasure unit-of-measure
     * @param productClass product-class
     */
    public getInventoryForItemBySupplier(
      productId: string,
      supplierId: string,
      unitOfMeasure: string,
      productClass: string
    ) {
      const deliveryMethod = 'SHP';
      return this.availabilitySvc.postByTenantIdV1AvailabilityNetworkBySupplierAndProductId({
          $queryParameters: {},
          tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
          body: { deliveryMethod, productClass, unitOfMeasure },
          productId,
          supplierId
      });
    }

    /**
     * fetches sku/item inventory at given physical nodes
     * @param itemId item-id
     * @param nodes nodes to fetch inventory for
     * @param unitOfMeasure unit-of-measure
     * @param productClass product-class
     */
    public getInventoryForSkuAtNodes(
      itemId: string,
      nodes: string[],
      unitOfMeasure: string,
      productClass: string
    ) {
      const reqPayload = {
        deliveryMethod: 'SHP',
        itemId,
        unitOfMeasure,
        productClass,
        shipNodes: nodes
      };

      console.log('Request payload getInventoryForSkuAtNodes', reqPayload);
      return this.availabilitySvc.postByTenantIdV1AvailabilityNode({
        $queryParameters: {},
        tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
        body: reqPayload,
        productId: itemId
      });
    }
}
