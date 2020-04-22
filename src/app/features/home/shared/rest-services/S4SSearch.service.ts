// -----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// 5725-Y11
//
// (C) Copyright IBM Corp. 2017
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
// -----------------------------------------------------------------

/* tslint:disable */
import { HttpClient } from '@angular/common/http';

import {
    Injectable
} from '@angular/core';
import {
    throwError,
    Observable
} from 'rxjs';

import { BucCommBEHttpWrapperService, BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';
import { Constants } from '../common/constants';

type PostSupplierInputList = {
    'supplier' ? : Array < PostSupplierInput > | PostSupplierInput
};

type PostSupplierInput = {
    'supplier_id': string
    'description' ? : string
    'supplier_type' ? : string
    'supplier_mailslot_id' ? : string
    'tenant_id': string
    'supplier_url' ? : string
    'contact_email' ? : string
    'contact_person': string
    'supplier_twitter': string
    'address_attributes' ? : Array < AddressAttrInput > | AddressAttrInput
};
type AddressAttrInput = {
    'name' ? : string
    'value' ? : string
};
type AuthenticationError = {
    'error' ? : string
    'error_description' ? : string
};
type AccessForbiddenError = {
    'error' ? : string
    'error_description' ? : string
};


@Injectable()
class S4SSearchService {

    private domain: string
    private resourceDomain: string
    private options: any

    constructor(private http: BucCommBEHttpWrapperService, private _httpClient: HttpClient) {
        this.resourceDomain = 'inventory'
        this.domain = BucCommBEHttpWrapperService.getPathPrefix(this.resourceDomain)
        this.options = BucCommBEHttpWrapperService.getRequestOptions(this.resourceDomain)
    }

    /**
    * Retrieves all products present in S4S

    * @method
    * @name S4SSearch#getProducts
         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} distributionGroupId - The unique identifier of the distribution group.
         * @param {string} transactionId - Prevents the processing of future requests with the same transaction ID.
    */
    public getProducts(parameters: {
        'tenantId' ?: string,
        'distributionGroupId' ?: string,
        'transactionId' ? : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {
      return this.invoke(`products`, parameters);
    }
     

 

  public getEntitledProductsBySupplierIds(parameters: SvcParameters): Observable<any> {
    let body = {};
    // allow use of param with or without underscore
    parameters['body'] = parameters['body'] || parameters['body'];

    if (parameters['body'] !== undefined) {
      body = parameters['body'];
    }

    if (parameters['body'] === undefined) {
      return throwError(new Error('Missing required  parameter: body'));
    }
    return this.post(`suppliers/products`, body, parameters);
    
  }

    
    /**
    * Retrieves all categories present in S4S
    * @method
    * @name S4SSearch#getAllCategories
    * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
    */
    public getAllCategories(parameters: {
        'tenantId' ?: string,
        'distributionGroupId' ?: string,
        'transactionId' ? : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {
      return this.invoke(`productcategories`, parameters);
    }

    /**
    * Retrieves all products present with in the passed category present in S4S
    * @method
    * @name S4SSearch#getAllProductsByCategoryId
    * @param {string} categoryId - The selected Category ID .
    */
    public getAllProductsByCategoryId(parameters: {
        'categoryId' : string,
        'transactionId' ? : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {
      return this.invoke(`productcategories/${parameters['categoryId']}/products`, parameters);
    }

    public fetchAllSuppliers(parameters: {
        'transactionId' ? : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {
      return this.invoke(`suppliers`, parameters);
    }

    public fetchProductList(parameters: {
        'tenantId' : string,
        'transactionId' ? : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean,
        'body': any,
    }): Observable < any > {
      let body = {};
      // allow use of param with or without underscore
      parameters['body'] = parameters['body'] || parameters['body'];

      if (parameters['body'] !== undefined) {
        body = parameters['body'];
      }

      if (parameters['body'] === undefined) {
        return throwError(new Error('Missing required  parameter: body'));
      }
      return this.post(`productslist`, body, parameters);
    }

    public getContactDetailsOfSelectedSupplier(parameters: {
        'supplierId'  : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {
      return this.invoke(`suppliers/${parameters['supplierId']}`, parameters);
    }

    public getItemDetails(parameters: {
        'childItemId'  : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {
      return this.invoke(`products/${parameters['childItemId']}`, parameters);
    }

    public getShipNodesForSupplier(parameters: {
      supplierId: string,
      $queryParameters?: any,
      $headers? : any,
      $cache?: any,
      $refresh?: any,
      useMocks?: boolean
    }): Observable<any> {
      return this.invoke(`suppliers/${parameters['supplierId']}/shipnodes`, parameters);
    }

    public postSuppliers(parameters: {
        'body': PostSupplierInput,
        'tenantId': string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {
      let body = {};
      // allow use of param with or without underscore
      parameters['body'] = parameters['body'] || parameters['body'];

      if (parameters['body'] !== undefined) {
        body = parameters['body'][0];
      }

      if (parameters['body'] === undefined) {
        return throwError(new Error('Missing required  parameter: body'));
      }
      return this.post(`suppliers`, body, parameters);
    }

    public getUserInfo(): Observable<any> {
      const userId = BucSvcAngularStaticAppInfoFacadeUtil.getCurrentUser().userName;
      return this.invoke(`users/${userId}`, {});
    }

    private invoke(api: string, parameters: SvcParameters, type: string = Constants.GET): Observable<any> {
      const headers = {
        Authorization: 'Basic OGE4MmpvaG5kb2h6NGFrbm54OW1kc3B6bTU0MTBuZDk6M3dodW0xcjRvejZ0N2RqMHdrN3lkZGpicm0wdXIwNHE=',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const hostPrefix = 'https://s4s-supplement-service-prod.mybluemix.net/s4s';
      const tenantId = BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId();

      // everything is GET for now
      const obs = this._httpClient.get(`${hostPrefix}/${tenantId}/${api}`, { headers });
      return obs;
    }

    private post(api: string, body:any, parameters: SvcParameters, type: string = Constants.POST): Observable<any> {
      const headers = {
        Authorization: 'Basic OGE4MmpvaG5kb2h6NGFrbm54OW1kc3B6bTU0MTBuZDk6M3dodW0xcjRvejZ0N2RqMHdrN3lkZGpicm0wdXIwNHE=',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const hostPrefix = 'https://s4s-supplement-service-prod.mybluemix.net/s4s';
      const tenantId = BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId();

      const obs = this._httpClient.post(`${hostPrefix}/${tenantId}/${api}`, body, { headers });
      return obs;
    }
}

interface SvcParameters {
  childItemId?: string;
  supplierId?: string;
  transactionId?: string;
  categoryId? : string;
  $queryParameters?: any;
  $headers?: any;
  $cache?: any;
  $refresh?: any;
  useMocks?: boolean;
  'tenantId'?: string;
  'body'?: any;
}

 

export {
  S4SSearchService,
  PostSupplierInputList,
  PostSupplierInput,
  AddressAttrInput,
  AuthenticationError,
  AccessForbiddenError

}
