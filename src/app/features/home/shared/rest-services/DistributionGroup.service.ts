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

import {
    Injectable
} from '@angular/core';
import {
    of as observableOf,
    throwError,
    Observable
} from 'rxjs';

import { BucCommBEHttpWrapperService } from '@buc/svc-angular';

type AuthenticationError = {
    'error' ? : string

    'error_description' ? : string

};
type AccessForbiddenError = {
    'error' ? : string

    'error_description' ? : string

};
type AdjustSupplyList = {
    'supplies' ? : Array < AdjustSupply >
        | AdjustSupply

};
type AdjustSupply = {
    'itemId': string

    'unitOfMeasure': string

    'productClass': string

    'tagNumber' ? : string

    'shipNode': string

    'type': string

    'segmentType' ? : string

    'segment' ? : string

    'eta': string

    'shipByDate': string

    'referenceType' ? : string

    'reference' ? : string

    'lineReference' ? : string

    'changedQuantity': number

    'adjustmentReason' ? : string

    'sourceTs' ? : string

    'reservations' ? : Array < ReservationInput >
        | ReservationInput

};
type AdjustDemandList = {
    'demands' ? : Array < AdjustDemand >
        | AdjustDemand

};
type AdjustDemand = {
    'itemId': string

    'unitOfMeasure': string

    'productClass': string

    'type': string

    'shipNode' ? : string

    'tagNumber' ? : string

    'segment' ? : string

    'segmentType' ? : string

    'shipDate': string

    'cancelDate': string

    'referenceType' ? : string

    'reference' ? : string

    'minShipByDate' ? : string

    'adjustmentReason' ? : string

    'changedQuantity': number

    'sourceTs' ? : string

    'reservations' ? : Array < ReservationInput >
        | ReservationInput

};
type SyncSupplyList = {
    'supplies' ? : Array < SyncSupply >
        | SyncSupply

};
type SyncSupply = {
    'itemId': string

    'unitOfMeasure': string

    'productClass': string

    'type': string

    'shipNode': string

    'tagNumber' ? : string

    'segment' ? : string

    'segmentType' ? : string

    'eta': string

    'shipByDate': string

    'referenceType' ? : string

    'reference' ? : string

    'lineReference' ? : string

    'quantity': number

    'sourceTs' ? : string

};
type SupplyResponse = {
    'itemId' ? : string

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'type' ? : string

    'shipNode' ? : string

    'tagNumber' ? : string

    'segment' ? : string

    'segmentType' ? : string

    'eta' ? : string

    'shipByDate' ? : string

    'referenceType' ? : string

    'reference' ? : string

    'lineReference' ? : string

    'quantity' ? : number

};
type SyncDemandList = {
    'demands' ? : Array < SyncDemand >
        | SyncDemand

};
type SyncDemand = {
    'itemId': string

    'unitOfMeasure': string

    'productClass': string

    'type': string

    'shipNode' ? : string

    'tagNumber' ? : string

    'segment' ? : string

    'segmentType' ? : string

    'shipDate': string

    'cancelDate': string

    'referenceType' ? : string

    'reference' ? : string

    'minShipByDate' ? : string

    'quantity': number

    'sourceTs' ? : string

};
type DemandResponse = {
    'itemId' ? : string

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'type' ? : string

    'shipNode' ? : string

    'tagNumber' ? : string

    'segment' ? : string

    'segmentType' ? : string

    'shipDate' ? : string

    'cancelDate' ? : string

    'referenceType' ? : string

    'reference' ? : string

    'minShipByDate' ? : string

    'quantity' ? : number

};
type ReservationInput = {
    'id' ? : string

    'reference' ? : string

    'quantity' ? : number

};
type PostReservationRequest = {
    'reference' ? : string

    'timeToExpire' ? : number

    'segment' ? : string

    'segmentType' ? : string

    'lines': Array < PostReservationRequestLine >
        | PostReservationRequestLine

};
type PostReservationRequestLine = {
    'lineId': string

    'itemId': string

    'unitOfMeasure': string

    'productClass': string

    'deliveryMethod': "SHP" | "PICK"

    'shipNode' ? : string

    'distributionGroup' ? : string

    'quantity': number

};
type PostReservationResponse = {
    'lines' ? : Array < PostReservationResponseLine >
        | PostReservationResponseLine

};
type PostReservationResponseLine = {
    'lineId': string

    'reservationId' ? : string

    'reservedQuantity': number

};
type GetReservationResponse = {
    'id' ? : string

    'reference' ? : string

    'reservationTs' ? : string

    'expirationTs' ? : string

    'itemId' ? : string

    'unitOfMeasure' ? : string

    'deliveryMethod' ? : "SHP" | "PICK"

    'productClass' ? : string

    'segment' ? : string

    'segmentType' ? : string

    'reservedQuantity' ? : number

};
type PatchReservationRequest = {
    'quantity' ? : number

};
type GetNetworkAvailabilityRequest = {
    'distributionGroupId': string

    'lines': Array < GetNetworkAvailabilityRequestLine >
        | GetNetworkAvailabilityRequestLine

    'segment' ? : string

    'segmentType' ? : string

};
type GetNetworkAvailabilityRequestLine = {
    'lineId': string

    'itemId': string

    'unitOfMeasure': string

    'productClass': string

    'deliveryMethod': "SHP" | "PICK"

    'distributionGroupId' ? : string

};
type GetNetworkAvailabilityResponse = {
    'lines' ? : Array < GetNetworkAvailabilityResponseLine >
        | GetNetworkAvailabilityResponseLine

};
type GetNetworkAvailabilityResponseLine = {
    'lineId' ? : string

    'networkAvailabilities' ? : Array < GetNetworkAvailabilityResponseNetworkAvailabilities >
        | GetNetworkAvailabilityResponseNetworkAvailabilities

};
type GetNetworkAvailabilityResponseNetworkAvailabilities = {
    'earliestShipTs' ? : string

    'totalAvailableQuantity' ? : number

    'onhandAvailableQuantity' ? : number

    'onhandEarliestShipTs' ? : string

    'onhandLatestShipTs' ? : string

    'futureAvailableQuantity' ? : number

    'futureEarliestShipTs' ? : string

    'futureLatestShipTs' ? : string

    'distributionGroupId' ? : string

    'alertLevel' ? : string

    'alertQuantity' ? : number

    'thresholdLevel' ? : 0 | 1 | 2 | 3

    'thresholdType' ? : "ONHAND" | "FUTURE"

    'thresholdQuantity' ? : number

};
type GetNodeAvailabilityRequest = {
    'lines': Array < GetNodeAvailabilityRequestLine >
        | GetNodeAvailabilityRequestLine

    'segment' ? : string

    'segmentType' ? : string

};
type GetNodeAvailabilityRequestLine = {
    'lineId': string

    'itemId': string

    'unitOfMeasure': string

    'productClass': string

    'deliveryMethod': "SHP" | "PICK"

    'shipNodes': Array < string >
        | string

};
type GetNodeAvailabilityResponse = {
    'lines' ? : Array < GetNodeAvailabilityResponseLine >
        | GetNodeAvailabilityResponseLine

};
type GetNodeAvailabilityResponseLine = {
    'lineId' ? : string

    'shipNodeAvailability' ? : Array < GetNodeAvailabilityResponseShipNodeAvailability >
        | GetNodeAvailabilityResponseShipNodeAvailability

};
type GetNodeAvailabilityResponseShipNodeAvailability = {
    'earliestShipTs' ? : string

    'latestShipTs' ? : string

    'totalAvailableQuantity' ? : number

    'shipNode' ? : string

    'onhandAvailableQuantity' ? : number

    'onhandEarliestShipTs' ? : string

    'onhandLatestShipTs' ? : string

    'futureAvailableQuantity' ? : number

    'futureEarliestShipTs' ? : string

    'futureLatestShipTs' ? : string

    'thresholdLevel' ? : number

    'thresholdType' ? : "ONHAND" | "FUTURE"

};
type DistributionGroupInList = {
    'distributionGroupId' ? : string

};
type DGShipNode = {
    'shipNode': string

};
type DistributionGroup = {
    'shipNodes' ? : Array < DGShipNode >
        | DGShipNode

};
type DistributionGroupForPut = {
    'shipNodes' ? : Array < DGShipNode >
        | DGShipNode

    'syncDgAvailability' ? : string

};
type Threshold = {
    'low': number

    'medium': number

    'high': number

};
type ItemConfiguration = {
    'threshold' ? : {
        'low' ? : number

        'medium' ? : number

        'high' ? : number

    }

};
type ItemFulfillmentOptions = {
    'shipNode' ? : string

    'deliveryMethod' ? : "SHP" | "PICK"

    'fulfillmentAllowed' ? : boolean

};
type FulfillmentOptions = {
    'fulfillmentAllowed' ? : boolean

};
type ShipNode = {
    'latitude' ? : number

    'longitude' ? : number

};
type ShipNodeResponse = {
    'shipNode' ? : string

    'latitude' ? : number

    'longitude' ? : number

};
type Settings = {
    'reservations' ? : {
        'defaultExpirationMinutes' ? : string

    }

};
type SafetyStock = {
    'unitOfMeasure': string

    'productClass': string

    'shipNode': string

    'deliveryMethod': "SHP" | "PICK"

    'safetyStockQuantity': number

};
type GetEventsResponse = Array < {
        'eventId' ? : string

    } >
    | {
        'eventId' ? : string

    }

;
type CreatePublisherRequest = {
    'type' ? : string

    'ubxToken' ? : string

    'url' ? : string

};
type PublisherResponse = {
    'type': string

    'ubxToken': string

    'url': string

    'publisherId' ? : string

};
type PublisherListResponse = Array < PublisherResponse >
    | PublisherResponse

;
type SupplyTypeResponse = {
    'type' ? : string

    'derivedFromType' ? : string

    'isOnhand' ? : boolean

};
type CreateSupplyType = {
    'derivedFromType' ? : string

};
type DemandTypeResponse = {
    'type' ? : string

    'derivedFromType' ? : string

    'commitmentLevel' ? : "Noncommitted" | "Promised" | "Allocated"

};
type CreateDemandType = {
    'derivedFromType' ? : string

};

@Injectable()
class DistributionGroupService {

    private domain: string
    private resourceDomain: string
    private options: any

    constructor(private http: BucCommBEHttpWrapperService) {
        this.resourceDomain = 'inventory'
        this.domain = BucCommBEHttpWrapperService.getPathPrefix(this.resourceDomain)
        this.options = BucCommBEHttpWrapperService.getRequestOptions(this.resourceDomain)
    }

    /**
    * Retrieves a list of distribution groups that are configured for a tenant.

    * @method
    * @name DistributionGroup#getByTenantIdV1ConfigurationDistributionGroups
         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} transactionId - Prevents the processing of future requests with the same transaction ID.
    */
    public getByTenantIdV1ConfigurationDistributionGroups(parameters: {
        'tenantId': string,
        'transactionId' ? : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {

        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        let path = '/{tenantId}/v1/configuration/distributionGroups'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['tenantId'] = parameters['tenantId'] || parameters['tenantId'];

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            return throwError(new Error('Missing required  parameter: tenantId'));
        }

        // allow use of param with or without underscore
        parameters['transactionId'] = parameters['transactionId'] || parameters['Transaction-Id'];

        if (parameters['transactionId'] !== undefined) {
            headers['Transaction-Id'] = parameters['transactionId'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    const parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        const url = this.domain + path;

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json; charset=utf-8';
        }

        // const cached = parameters.$cache && parameters.$cache.get(url);
        // if (cached !== undefined && !parameters.$refresh) {
        //     return Observable.of(cached).map(o => JSON.stringify(o));
        // }
 
        
        
        const obsToReturn$ = this.http.get(url, this.resourceDomain, queryParameters, this.options);

        return obsToReturn$;
    }
    /**
    * Retrieves the details of a distribution group based on the provided distribution group ID and tenant ID.

    * @method
    * @name DistributionGroup#getByTenantIdV1ConfigurationDistributionGroupsByDistributionGroupId
         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} distributionGroupId - The unique identifier of the distribution group.
         * @param {string} transactionId - Prevents the processing of future requests with the same transaction ID.
    */
    public getByTenantIdV1ConfigurationDistributionGroupsByDistributionGroupId(parameters: {
        'tenantId': string,
        'distributionGroupId': string,
        'transactionId' ? : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {

        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        let path = '/{tenantId}/v1/configuration/distributionGroups/{distributionGroupId}'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['tenantId'] = parameters['tenantId'] || parameters['tenantId'];

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            return throwError(new Error('Missing required  parameter: tenantId'));
        }

        // allow use of param with or without underscore
        parameters['distributionGroupId'] = parameters['distributionGroupId'] || parameters['distributionGroupId'];

        path = path.replace('{distributionGroupId}', parameters['distributionGroupId']);

        if (parameters['distributionGroupId'] === undefined) {
            return throwError(new Error('Missing required  parameter: distributionGroupId'));
        }

        // allow use of param with or without underscore
        parameters['transactionId'] = parameters['transactionId'] || parameters['Transaction-Id'];

        if (parameters['transactionId'] !== undefined) {
            headers['Transaction-Id'] = parameters['transactionId'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    const parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        const url = this.domain + path;

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json; charset=utf-8';
        }

        // const cached = parameters.$cache && parameters.$cache.get(url);
        // if (cached !== undefined && !parameters.$refresh) {
        //     return Observable.of(cached).map(o => JSON.stringify(o));
        // }
        
        const obsToReturn$ = this.http.get(url, this.resourceDomain, queryParameters, this.options);

        return obsToReturn$;
    }
    /**
    * Creates or updates a distribution group with the provided details.

    * @method
    * @name DistributionGroup#putByTenantIdV1ConfigurationDistributionGroupsByDistributionGroupId
         * @param {} body - Input JSON
         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} distributionGroupId - The unique identifier of the distribution group.
         * @param {string} transactionId - Prevents the processing of future requests with the same transaction ID.
    */
    public putByTenantIdV1ConfigurationDistributionGroupsByDistributionGroupId(parameters: {
        'body': DistributionGroupForPut,
        'tenantId': string,
        'distributionGroupId': string,
        'transactionId' ? : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {

        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        let path = '/{tenantId}/v1/configuration/distributionGroups/{distributionGroupId}'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['body'] = parameters['body'] || parameters['body'];

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            return throwError(new Error('Missing required  parameter: body'));
        }

        // allow use of param with or without underscore
        parameters['tenantId'] = parameters['tenantId'] || parameters['tenantId'];

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            return throwError(new Error('Missing required  parameter: tenantId'));
        }

        // allow use of param with or without underscore
        parameters['distributionGroupId'] = parameters['distributionGroupId'] || parameters['distributionGroupId'];

        path = path.replace('{distributionGroupId}', parameters['distributionGroupId']);

        if (parameters['distributionGroupId'] === undefined) {
            return throwError(new Error('Missing required  parameter: distributionGroupId'));
        }

        // allow use of param with or without underscore
        parameters['transactionId'] = parameters['transactionId'] || parameters['Transaction-Id'];

        if (parameters['transactionId'] !== undefined) {
            headers['Transaction-Id'] = parameters['transactionId'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    const parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        const url = this.domain + path;

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json; charset=utf-8';
        }
        const obsToReturn$ = this.http.put(url, this.resourceDomain, queryParameters, body, this.options);

        return obsToReturn$;
    }
    /**
    * Deletes a distribution group for the provided distribution group ID.

    * @method
    * @name DistributionGroup#deleteByTenantIdV1ConfigurationDistributionGroupsByDistributionGroupId
         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} distributionGroupId - The unique identifier of the distribution group.
         * @param {string} transactionId - Prevents the processing of future requests with the same transaction ID.
    */
    public deleteByTenantIdV1ConfigurationDistributionGroupsByDistributionGroupId(parameters: {
        'tenantId': string,
        'distributionGroupId': string,
        'transactionId' ? : string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {

        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        let path = '/{tenantId}/v1/configuration/distributionGroups/{distributionGroupId}'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['tenantId'] = parameters['tenantId'] || parameters['tenantId'];

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            return throwError(new Error('Missing required  parameter: tenantId'));
        }

        // allow use of param with or without underscore
        parameters['distributionGroupId'] = parameters['distributionGroupId'] || parameters['distributionGroupId'];

        path = path.replace('{distributionGroupId}', parameters['distributionGroupId']);

        if (parameters['distributionGroupId'] === undefined) {
            return throwError(new Error('Missing required  parameter: distributionGroupId'));
        }

        // allow use of param with or without underscore
        parameters['transactionId'] = parameters['transactionId'] || parameters['Transaction-Id'];

        if (parameters['transactionId'] !== undefined) {
            headers['Transaction-Id'] = parameters['transactionId'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    const parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        const url = this.domain + path;

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json; charset=utf-8';
        }
        
        const obsToReturn$ = this.http.delete(url, this.resourceDomain, queryParameters, body, this.options);

        return obsToReturn$;
    }
}

export {
  DistributionGroupService,
  AuthenticationError,
  AccessForbiddenError,
  AdjustSupplyList,
  AdjustSupply,
  AdjustDemandList,
  AdjustDemand,
  SyncSupplyList,
  SyncSupply,
  SupplyResponse,
  SyncDemandList,
  SyncDemand,
  DemandResponse,
  ReservationInput,
  PostReservationRequest,
  PostReservationRequestLine,
  PostReservationResponse,
  PostReservationResponseLine,
  GetReservationResponse,
  PatchReservationRequest,
  GetNetworkAvailabilityRequest,
  GetNetworkAvailabilityRequestLine,
  GetNetworkAvailabilityResponse,
  GetNetworkAvailabilityResponseLine,
  GetNetworkAvailabilityResponseNetworkAvailabilities,
  GetNodeAvailabilityRequest,
  GetNodeAvailabilityRequestLine,
  GetNodeAvailabilityResponse,
  GetNodeAvailabilityResponseLine,
  GetNodeAvailabilityResponseShipNodeAvailability,
  DistributionGroupInList,
  DGShipNode,
  DistributionGroup,
  DistributionGroupForPut,
  Threshold,
  ItemConfiguration,
  ItemFulfillmentOptions,
  FulfillmentOptions,
  ShipNode,
  ShipNodeResponse,
  Settings,
  SafetyStock,
  GetEventsResponse,
  CreatePublisherRequest,
  PublisherResponse,
  PublisherListResponse,
  SupplyTypeResponse,
  CreateSupplyType,
  DemandTypeResponse,
  CreateDemandType
}