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

/* tslint:disable */

import {
    Injectable
} from '@angular/core';
import {
    throwError
} from 'rxjs';
import { BucCommBEHttpWrapperService } from '@buc/svc-angular';

type AdjustSupplyList = {
    'supplies' ? : Array < AdjustSupply >
        | AdjustSupply

};
type AdjustSupply = {
    'itemId': string

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'tagNumber' ? : string

    'shipNode': string

    'type': "PO" | "PO_PLACED" | "PO_BACKORDER" | "PO_SCHEDULED" | "PO_RELEASED" | "INTRANSIT" | "PLANNED_PO" | "PLANNED_TRANSFER" | "ONHAND" | "HELD" | "WIP" | "WO_PLACED"

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

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'type': "OPEN_ORDER" | "RSRV_ORDER" | "ALLOCATED" | "BACKORDER" | "FORECAST" | "FIRM_FORECAST" | "SCHEDULED"

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

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'type': "PO" | "PO_PLACED" | "PO_BACKORDER" | "PO_SCHEDULED" | "PO_RELEASED" | "INTRANSIT" | "PLANNED_PO" | "PLANNED_TRANSFER" | "ONHAND" | "HELD" | "WIP" | "WO_PLACED"

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

    'type' ? : "PO" | "PO_PLACED" | "PO_BACKORDER" | "PO_SCHEDULED" | "PO_RELEASED" | "INTRANSIT" | "PLANNED_PO" | "PLANNED_TRANSFER" | "ONHAND" | "HELD" | "WIP" | "WO_PLACED"

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

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'type': "OPEN_ORDER" | "RSRV_ORDER" | "ALLOCATED" | "BACKORDER" | "FORECAST" | "FIRM_FORECAST" | "SCHEDULED"

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

    'type' ? : "OPEN_ORDER" | "RSRV_ORDER" | "ALLOCATED" | "BACKORDER" | "FORECAST" | "FIRM_FORECAST" | "SCHEDULED"

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

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'deliveryMethod': string

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

    'status' ? : 0 | 1 | 2

    'reservationTs' ? : string

    'expirationTs' ? : string

    'itemId' ? : string

    'unitOfMeasure' ? : string

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

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'deliveryMethod': string

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

    'thresholdQuantity' ? : number

};
type GetNodeAvailabilityRequest = {
    'lines': Array < GetNodeAvailabilityRequestLine >
        | GetNodeAvailabilityRequestLine

    'segment' ? : string

    'segmentType' ? : string

};
type GetNodeAvailabilityRequestLine = {
    'lineId' ?: string

    'itemId': string

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'deliveryMethod': string

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

    'onhandSafetyQuantity' ? : number

    'futureSafetyQuantity' ? : number

};
type GetNodeAvailabilityProductBreakupRequest = {
    'demandType': string

    'segment': string

    'segmentType': string

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'deliveryMethod': string

    'shipNodes': Array < string >
        | string

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
        'defaultExpirationMinutes' ? : number

    }

};
type SafetyStock = {
    'unitOfMeasure' ? : string

    'productClass' ? : string

    'shipNode' ? : string

    'deliveryMethod' ? : string

    'safetyStockQuantity': number

};
type GetEventsResponse = Array < {
        'eventId' ? : string

    } >
    | {
        'eventId' ? : string

    }

;
type Publisher = {
    'type' ? : string

    'ubxToken' ? : string

    'url' ? : string

    'publisherId' ? : string

};
type GetPublishersResponse = Array < Publisher >
    | Publisher

;
type AuthenticationError = {
    'error' ? : string

    'error_description' ? : string

};
type AccessForbiddenError = {
    'error' ? : string

    'error_description' ? : string

};

@Injectable()
class AvailabilityService {

    private domain: string
    private resourceDomain: string
    private options: any

    constructor(private http: BucCommBEHttpWrapperService) {
        this.resourceDomain = 'inventory'
        this.domain = BucCommBEHttpWrapperService.getPathPrefix(this.resourceDomain)
        this.options = BucCommBEHttpWrapperService.getRequestOptions(this.resourceDomain)
    }


    public postByTenantIdV1AvailabilityNetworkBySupplierAndProductId(parameters: {
        'body': any,
        'tenantId': string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean,
        productId ? : string,
        supplierId ? : string 
    }){
        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        let path = '/{tenantId}/v1/availability/'+parameters['productId']+'/network/'+parameters['supplierId'];
       

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
        //console.log('Padman Before invoking the request' , url, body);
        const obsToReturn$ = this.http.post(url, this.resourceDomain, queryParameters, body, this.options);
        //console.log('Padman Availability by N/w' , obsToReturn$);
        return obsToReturn$;
    }
    /**
    * Provides the current availability picture, including non-expired reservations, at the network level. Responds with availability based on configured distribution groups.

    * @method
    * @name Availability#postByTenantIdV1AvailabilityNetwork
         * @param {} body - Input JSON
         * @param {string} tenantId - The IBM provided tenant ID to access your APIs.
    */
    public postByTenantIdV1AvailabilityNetwork(parameters: {
        'body': any,
        'tenantId': string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean,
        productId ? : string,
        supplierId ? : string ,
        itemId ?: string, 
        dgId ?: string
    }){

        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        let path ;
        if(parameters['itemId']  === undefined){
            path = '/{tenantId}/v1/availability/network';
        }else{
            path = '/{tenantId}/v1/availability/'+parameters['itemId'] +'/network/'+parameters['dgId'] ;
        }
        
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
        const obsToReturn$ = this.http.post(url, this.resourceDomain, queryParameters, body, this.options);
        return obsToReturn$;
    }
    /**
    * Provides the current availability picture, including non-expired reservations, at the node level. Responds with availability based on requested nodes.

    * @method
    * @name Availability#postByTenantIdV1AvailabilityNode
         * @param {} body - Input JSON
         * @param {string} tenantId - The IBM provided tenant ID to access your APIs.
    */
    public postByTenantIdV1AvailabilityNode(parameters: {
        'body',
        'tenantId': string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean,
        'productId' ? : string
    }) {

        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        
        let path = '/us-4474f893/v1/availability/'+parameters['productId']+'/node'
         
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
        console.log('url body', url, body, this.options, queryParameters);
        
        const obsToReturn$ = this.http.post(url, this.resourceDomain, queryParameters, body, this.options);

        return obsToReturn$;
    }
    /**
    * Provides the current availability picture, including non-expired reservations, at the node level. Responds with availability based on requested nodes.

    * @method
    * @name Availability#postByTenantIdV1AvailabilityNode
         * @param {} body - Input JSON
         * @param {string} tenantId - The IBM provided tenant ID to access your APIs.
    */
   public postByTenantIdV1AvailabilityNodeProductBreakup(parameters: {
    'body': GetNodeAvailabilityProductBreakupRequest,
    'tenantId': string,
    'itemId': string,
    $queryParameters ? : any,
    $headers ? : any,
    $cache ? : any,
    $refresh ? : any,
    useMocks ? : boolean
    }) {

        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        let path = '/{tenantId}/v1/availability/{itemId}/node'

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
        parameters['itemId'] = parameters['itemId'] || parameters['itemId'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            return throwError(new Error('Missing required  parameter: itemId'));
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

        const obsToReturn$ = this.http.post(url, this.resourceDomain, queryParameters, body, this.options);

        return obsToReturn$;
    }
}

export {
    AvailabilityService,

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
    GetNodeAvailabilityProductBreakupRequest,
    DistributionGroupInList,
    DGShipNode,
    DistributionGroup,
    DistributionGroupForPut,
    Threshold,
    ShipNode,
    ShipNodeResponse,
    Settings,
    SafetyStock,
    GetEventsResponse,
    Publisher,
    GetPublishersResponse,
    AuthenticationError,
    AccessForbiddenError,
}