import { Injectable } from '@angular/core';
import { BucCommOmsRestAPIService } from '@buc/svc-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DistributionGroupService } from '../rest-services/DistributionGroup.service';
import { S4SSearchService } from '../rest-services/S4SSearch.service';
import { ShipNodeService } from '../rest-services/ShipNode.service';
import { catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';

@Injectable({
  providedIn: 'root'
})
export class InventoryDistributionService {

  constructor(
    private dgSvc: DistributionGroupService,
    private s4sSvc: S4SSearchService,
    private shipNodeSvc : ShipNodeService
  ) { }

  public getDistributionRuleDetails(dgId: string): Observable<any> {
      const tenId = BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId();
      return this.dgSvc.getByTenantIdV1ConfigurationDistributionGroupsByDistributionGroupId(
        { tenantId: tenId, distributionGroupId: dgId})
      .pipe(
        map(r => r.shipNodes)
      );
  }

  public getDistributionRuleListByPage(): Observable<DistributionRuleListApiResponse> {
    const tenantId = BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId();
    return this.dgSvc.getByTenantIdV1ConfigurationDistributionGroups({ tenantId })
    .pipe(
      map(r => ({ distributionGroups: r.map(dg => ({ dgId: dg.distributionGroupId, dgName: dg.distributionGroupId })) }))
    );
  }
 
  public getProducts(): Observable<any> {
    return this.s4sSvc.getProducts(  {} )
    .pipe( map(r => r) );
  }

  public getAllCategories(): Observable<any> {
    return this.s4sSvc.getAllCategories({})
    .pipe( map(r => r) );
  }
  
  public getAllProductsByCategoryId(selectedCategoryId : string): Observable<any> {
    return this.s4sSvc.getAllProductsByCategoryId({categoryId : selectedCategoryId})
    .pipe( map(r => r) );
  }

  public fetchAllSuppliers(): Observable<any> {
    return this.s4sSvc.fetchAllSuppliers({} )
    .pipe( map(r => r) );
  }

  public fetchProductList(productIds : string[]): Observable<any> {
    const tenantId = BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId();
    const reqPayLoad = { item_id: productIds };
    return this.s4sSvc.fetchProductList({tenantId : tenantId, body:reqPayLoad} )
    .pipe( map(r => r) );
  }
  
  public getContactDetailsOfSelectedSupplier(supplierId : string): Observable<any> {
    return this.s4sSvc.getContactDetailsOfSelectedSupplier({supplierId : supplierId} )
    .pipe( map(r => r) );
  }
   
  public getChildItemDetails(childItemId : string): Observable<any> { 
    return this.s4sSvc.getItemDetails({childItemId : childItemId} )
    .pipe( map(r => r) )
    .pipe(catchError((err) => observableOf([])));
  }

  public getByTenantIdV1ConfigurationShipNodes(): Observable<any> {  
    const tenantId = BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId();
    return this.shipNodeSvc.getByTenantIdV1ConfigurationShipNodes({ tenantId : tenantId } )
    .pipe( map(r => r) );
  }
  
  
  
  
}

export interface DistributionRuleListApiResponse {
  pageSetToken?: string;
  isLastPage?: boolean;
  isFirstPage?: boolean;
  isValidPage?: boolean;
  distributionGroups: Array<DistributionGroup>;
  totalNumberOfRecords?: string;
}

export interface DistributionGroup {
  dgId: string;
  isValid: boolean;
  dgName?: string;
  dgType?: string;
  dgKey?: string;
  dgPurpose: string;
  itemShipNodes: {
    ItemShipNode: any[]
  }; 
}
