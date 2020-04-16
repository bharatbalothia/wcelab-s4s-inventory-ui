
import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { SupplyService } from '../rest-services/Supply.service';
import { getItemUniqueKey } from '../common/functions';

@Injectable({
  providedIn: 'root'
})
export class InventorySupplyService {

  constructor(private supplySvc: SupplyService) {
  }

  public getMultiSkuSupplyByNodes(skus: SupplyRequestSkuDescriptor[], nodeIds: string[]) {
    const rc: Array<SupplyResponseDescriptor> = [];
    const asMap: { [ key: string ]: SupplyResponseDescriptor } = {};
    const tuples: Array<{ sku: SupplyRequestSkuDescriptor, nodeId: string }> = [];
    skus.forEach(sku => {
      asMap[sku.key] = { sku, key: sku.key, supply: [] };
      rc.push(asMap[sku.key]);
      tuples.push(... nodeIds.map(nodeId => ({ sku, nodeId })));
    });

    return forkJoin(tuples.map(t => this._get(t.sku, t.nodeId)))
    .pipe(
      map((allResponses: any[]) => {
        allResponses
        .filter((tupleResponse: any[]) => tupleResponse.length > 0)
        .forEach((tupleResponse: any[]) => {
          const r = tupleResponse[0];
          const o = asMap[getItemUniqueKey(r.itemId, r.unitOfMeasure, r.productClass || '')];
          o.supply.push(... tupleResponse);
        });
        return rc;
      })
    );
  }

  private _get(sku: SupplyRequestSkuDescriptor, shipNode: string) {
    return this.supplySvc.getByTenantIdV1Supplies({
      itemId: sku.itemId,
      unitOfMeasure: sku.unitOfMeasure,
      productClass: sku.productClass,
      shipNode,
      segment: undefined,
      tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId()
    })
    .pipe(
      catchError((e) => of([]))
    );
  }
}

export interface SupplyRequestSkuDescriptor {
  itemId: string;
  unitOfMeasure: string;
  productClass: string;
  key: string;
}

export interface SupplyResponseDescriptor {
  sku: SupplyRequestSkuDescriptor;
  key: string;
  supply: any[];
}
