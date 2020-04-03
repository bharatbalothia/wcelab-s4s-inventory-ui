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

import { Injectable } from '@angular/core';
import { throwError, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
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
class ItemService {

    private domain: string
    private resourceDomain: string
    private options: any

    constructor(private http: BucCommBEHttpWrapperService) {
        this.resourceDomain = 'inventory'
        this.domain = BucCommBEHttpWrapperService.getPathPrefix(this.resourceDomain)
        this.options = BucCommBEHttpWrapperService.getRequestOptions(this.resourceDomain)
    }

    /**
    * Gets the thresholds configuration for the criteria provided as query parameters. For more information refer to [Inventory thresholds](https://www.ibm.com/support/knowledgecenter/SSSMTK/com.ibm.help.oncloud.invservice.doc/c_IS_InventoryThresholds.html).

    * @method
    * @name Item#getByTenantIdV1ConfigurationItemsByItemId
         * @param {string} unitOfMeasure - The unit of measure in the context of the item's quantity. For example, 1 `DOZEN` egg or 2.7 `YARD` of fabric.
         * @param {string} productClass - A means of describing the quality of inventory for the item. For example, OPEN_BOX to represent open box inventory.
         * @param {string} shipNode - The ship node associated with the item. Required if `distributionGroup` is not provided.
         * @param {string} distributionGroup - The distribution group associated with the item. Required if `shipNode` is not provided.
         * @param {string} deliveryMethod - Indicates the delivery method specified for an item. Use `SHP` when the item should be fulfilled via shipping. Use `PICK` when the item should be picked up from store.

         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} itemId - The unique identifier of an item.
    */
    public getByTenantIdV1ConfigurationItemsByItemId(parameters: {
        'unitOfMeasure': string,
        'productClass': string,
        'shipNode' ? : string,
        'distributionGroup' ? : string,
        'deliveryMethod': "SHP" | "PICK",
        'tenantId': string,
        'itemId': string,
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
        let path = '/{tenantId}/v1/configuration/items/{itemId}'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['unitOfMeasure'] = parameters['unitOfMeasure'] || parameters['unitOfMeasure'];

        if (parameters['unitOfMeasure'] !== undefined) {
            queryParameters['unitOfMeasure'] = parameters['unitOfMeasure'];
        }

        if (parameters['unitOfMeasure'] === undefined) {
            return throwError(new Error('Missing required  parameter: unitOfMeasure'));
        }

        // allow use of param with or without underscore
        parameters['productClass'] = parameters['productClass'] || parameters['productClass'];

        if (parameters['productClass'] !== undefined) {
            queryParameters['productClass'] = parameters['productClass'];
        }

        if (parameters['productClass'] === undefined) {
            return throwError(new Error('Missing required  parameter: productClass'));
        }

        // allow use of param with or without underscore
        parameters['shipNode'] = parameters['shipNode'] || parameters['shipNode'];

        if (parameters['shipNode'] !== undefined) {
            queryParameters['shipNode'] = parameters['shipNode'];
        }

        // allow use of param with or without underscore
        parameters['distributionGroup'] = parameters['distributionGroup'] || parameters['distributionGroup'];

        if (parameters['distributionGroup'] !== undefined) {
            queryParameters['distributionGroup'] = parameters['distributionGroup'];
        }

        // allow use of param with or without underscore
        parameters['deliveryMethod'] = parameters['deliveryMethod'] || parameters['deliveryMethod'];

        if (parameters['deliveryMethod'] !== undefined) {
            queryParameters['deliveryMethod'] = parameters['deliveryMethod'];
        }

        if (parameters['deliveryMethod'] === undefined) {
            return throwError(new Error('Missing required  parameter: deliveryMethod'));
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

        const cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && !parameters.$refresh) {
            return observableOf(cached).pipe(map(o => JSON.stringify(o)));
        }

        const obsToReturn$ = this.http.get(url, this.resourceDomain, queryParameters, this.options);

        return obsToReturn$;
    }
    /**
    * This API will update the configuration for items matching the provided criteria. For more information refer to [Inventory thresholds](https://www.ibm.com/support/knowledgecenter/SSSMTK/com.ibm.help.oncloud.invservice.doc/c_IS_InventoryThresholds.html).

    * @method
    * @name Item#patchByTenantIdV1ConfigurationItemsByItemId
         * @param {string} unitOfMeasure - The unit of measure in the context of the item's quantity. For example, 1 `DOZEN` egg or 2.7 `YARD` of fabric.
         * @param {string} productClass - A means of describing the quality of inventory for the item. For example, OPEN_BOX to represent open box inventory.
         * @param {string} shipNode - The ship node associated with the item. Required if `distributionGroup` is not provided.
         * @param {string} distributionGroup - The distribution group associated with the item. Required if `shipNode` is not provided.
         * @param {string} deliveryMethod - Indicates the delivery method specified for an item. Use `SHP` when the item should be fulfilled via shipping. Use `PICK` when the item should be picked up from store.

         * @param {} body - Input JSON
         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} itemId - The unique identifier of an item.
    */
    public patchByTenantIdV1ConfigurationItemsByItemId(parameters: {
        'unitOfMeasure': string,
        'productClass': string,
        'shipNode' ? : string,
        'distributionGroup' ? : string,
        'deliveryMethod': "SHP" | "PICK",
        'body': ItemConfiguration,
        'tenantId': string,
        'itemId': string,
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
        let path = '/{tenantId}/v1/configuration/items/{itemId}'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['unitOfMeasure'] = parameters['unitOfMeasure'] || parameters['unitOfMeasure'];

        if (parameters['unitOfMeasure'] !== undefined) {
            queryParameters['unitOfMeasure'] = parameters['unitOfMeasure'];
        }

        if (parameters['unitOfMeasure'] === undefined) {
            return throwError(new Error('Missing required  parameter: unitOfMeasure'));
        }

        // allow use of param with or without underscore
        parameters['productClass'] = parameters['productClass'] || parameters['productClass'];

        if (parameters['productClass'] !== undefined) {
            queryParameters['productClass'] = parameters['productClass'];
        }

        if (parameters['productClass'] === undefined) {
            return throwError(new Error('Missing required  parameter: productClass'));
        }

        // allow use of param with or without underscore
        parameters['shipNode'] = parameters['shipNode'] || parameters['shipNode'];

        if (parameters['shipNode'] !== undefined) {
            queryParameters['shipNode'] = parameters['shipNode'];
        }

        // allow use of param with or without underscore
        parameters['distributionGroup'] = parameters['distributionGroup'] || parameters['distributionGroup'];

        if (parameters['distributionGroup'] !== undefined) {
            queryParameters['distributionGroup'] = parameters['distributionGroup'];
        }

        // allow use of param with or without underscore
        parameters['deliveryMethod'] = parameters['deliveryMethod'] || parameters['deliveryMethod'];

        if (parameters['deliveryMethod'] !== undefined) {
            queryParameters['deliveryMethod'] = parameters['deliveryMethod'];
        }

        if (parameters['deliveryMethod'] === undefined) {
            return throwError(new Error('Missing required  parameter: deliveryMethod'));
        }

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

        const obsToReturn$ = this.http.patch(url, this.resourceDomain, queryParameters, body, this.options);

        return obsToReturn$;
    }
    /**
    * This API will remove the configuration for items matching the provided criteria. For more information refer to [Inventory thresholds](https://www.ibm.com/support/knowledgecenter/SSSMTK/com.ibm.help.oncloud.invservice.doc/c_IS_InventoryThresholds.html).

    * @method
    * @name Item#deleteByTenantIdV1ConfigurationItemsByItemId
         * @param {string} unitOfMeasure - The unit of measure in the context of the item's quantity. For example, 1 `DOZEN` egg or 2.7 `YARD` of fabric.
         * @param {string} productClass - A means of describing the quality of inventory for the item. For example, OPEN_BOX to represent open box inventory.
         * @param {string} shipNode - The ship node associated with the item. Required if `distributionGroup` is not provided.
         * @param {string} distributionGroup - The distribution group associated with the item. Required if `shipNode` is not provided.
         * @param {string} deliveryMethod - Indicates the delivery method specified for an item. Use `SHP` when the item should be fulfilled via shipping. Use `PICK` when the item should be picked up from store.

         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} itemId - The unique identifier of an item.
    */
    public deleteByTenantIdV1ConfigurationItemsByItemId(parameters: {
        'unitOfMeasure': string,
        'productClass': string,
        'shipNode' ? : string,
        'distributionGroup' ? : string,
        'deliveryMethod': "SHP" | "PICK",
        'tenantId': string,
        'itemId': string,
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
        let path = '/{tenantId}/v1/configuration/items/{itemId}'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['unitOfMeasure'] = parameters['unitOfMeasure'] || parameters['unitOfMeasure'];

        if (parameters['unitOfMeasure'] !== undefined) {
            queryParameters['unitOfMeasure'] = parameters['unitOfMeasure'];
        }

        if (parameters['unitOfMeasure'] === undefined) {
            return throwError(new Error('Missing required  parameter: unitOfMeasure'));
        }

        // allow use of param with or without underscore
        parameters['productClass'] = parameters['productClass'] || parameters['productClass'];

        if (parameters['productClass'] !== undefined) {
            queryParameters['productClass'] = parameters['productClass'];
        }

        if (parameters['productClass'] === undefined) {
            return throwError(new Error('Missing required  parameter: productClass'));
        }

        // allow use of param with or without underscore
        parameters['shipNode'] = parameters['shipNode'] || parameters['shipNode'];

        if (parameters['shipNode'] !== undefined) {
            queryParameters['shipNode'] = parameters['shipNode'];
        }

        // allow use of param with or without underscore
        parameters['distributionGroup'] = parameters['distributionGroup'] || parameters['distributionGroup'];

        if (parameters['distributionGroup'] !== undefined) {
            queryParameters['distributionGroup'] = parameters['distributionGroup'];
        }

        // allow use of param with or without underscore
        parameters['deliveryMethod'] = parameters['deliveryMethod'] || parameters['deliveryMethod'];

        if (parameters['deliveryMethod'] !== undefined) {
            queryParameters['deliveryMethod'] = parameters['deliveryMethod'];
        }

        if (parameters['deliveryMethod'] === undefined) {
            return throwError(new Error('Missing required  parameter: deliveryMethod'));
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

        const obsToReturn$ = this.http.delete(url, this.resourceDomain, queryParameters, body, this.options);

        return obsToReturn$;
    }
    /**
    * Retrieve the fulfillment options enabled for the item criteria.

    * @method
    * @name Item#getByTenantIdV1ConfigurationItemsByItemIdFulfillmentOptions
         * @param {string} unitOfMeasure - The unit of measure in the context of the item's quantity. For example, 1 `DOZEN` egg or 2.7 `YARD` of fabric.
         * @param {string} productClass - A means of describing the quality of inventory for the item. For example, OPEN_BOX to represent open box inventory.
         * @param {string} shipNode - The ship node associated with the item.
         * @param {string} deliveryMethod - Indicates the delivery method specified for an item. Use `SHP` when the item should be fulfilled via shipping. Use `PICK` when the item should be picked up from store.

         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} itemId - The unique identifier of an item.
    */
    public getByTenantIdV1ConfigurationItemsByItemIdFulfillmentOptions(parameters: {
        'unitOfMeasure': string,
        'productClass': string,
        'shipNode': string,
        'deliveryMethod': "SHP" | "PICK",
        'tenantId': string,
        'itemId': string,
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
        let path = '/{tenantId}/v1/configuration/items/{itemId}/fulfillment_options'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['unitOfMeasure'] = parameters['unitOfMeasure'] || parameters['unitOfMeasure'];

        if (parameters['unitOfMeasure'] !== undefined) {
            queryParameters['unitOfMeasure'] = parameters['unitOfMeasure'];
        }

        if (parameters['unitOfMeasure'] === undefined) {
            return throwError(new Error('Missing required  parameter: unitOfMeasure'));
        }

        // allow use of param with or without underscore
        parameters['productClass'] = parameters['productClass'] || parameters['productClass'];

        if (parameters['productClass'] !== undefined) {
            queryParameters['productClass'] = parameters['productClass'];
        }

        if (parameters['productClass'] === undefined) {
            return throwError(new Error('Missing required  parameter: productClass'));
        }

        // allow use of param with or without underscore
        parameters['shipNode'] = parameters['shipNode'] || parameters['shipNode'];

        if (parameters['shipNode'] !== undefined) {
            queryParameters['shipNode'] = parameters['shipNode'];
        }

        if (parameters['shipNode'] === undefined) {
            return throwError(new Error('Missing required  parameter: shipNode'));
        }

        // allow use of param with or without underscore
        parameters['deliveryMethod'] = parameters['deliveryMethod'] || parameters['deliveryMethod'];

        if (parameters['deliveryMethod'] !== undefined) {
            queryParameters['deliveryMethod'] = parameters['deliveryMethod'];
        }

        if (parameters['deliveryMethod'] === undefined) {
            return throwError(new Error('Missing required  parameter: deliveryMethod'));
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

        const cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && !parameters.$refresh) {
            return observableOf(cached).pipe(map(o => JSON.stringify(o)));
        }

        const obsToReturn$ = this.http.get(url, this.resourceDomain, queryParameters, this.options);

        return obsToReturn$;
    }
    /**
    * Update fulfillment option for the matching item criteria.

    * @method
    * @name Item#patchByTenantIdV1ConfigurationItemsByItemIdFulfillmentOptions
         * @param {string} unitOfMeasure - The unit of measure in the context of the item's quantity. For example, 1 `DOZEN` egg or 2.7 `YARD` of fabric.
         * @param {string} productClass - A means of describing the quality of inventory for the item. For example, OPEN_BOX to represent open box inventory.
         * @param {string} shipNode - The ship node associated with the item.
         * @param {string} deliveryMethod - Indicates the delivery method specified for an item. Use `SHP` when the item should be fulfilled via shipping. Use `PICK` when the item should be picked up from store.

         * @param {} body - Input JSON
         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} itemId - The unique identifier of an item.
    */
    public patchByTenantIdV1ConfigurationItemsByItemIdFulfillmentOptions(parameters: {
        'unitOfMeasure': string,
        'productClass': string,
        'shipNode': string,
        'deliveryMethod': "SHP" | "PICK",
        'body': FulfillmentOptions,
        'tenantId': string,
        'itemId': string,
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
        let path = '/{tenantId}/v1/configuration/items/{itemId}/fulfillment_options'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['unitOfMeasure'] = parameters['unitOfMeasure'] || parameters['unitOfMeasure'];

        if (parameters['unitOfMeasure'] !== undefined) {
            queryParameters['unitOfMeasure'] = parameters['unitOfMeasure'];
        }

        if (parameters['unitOfMeasure'] === undefined) {
            return throwError(new Error('Missing required  parameter: unitOfMeasure'));
        }

        // allow use of param with or without underscore
        parameters['productClass'] = parameters['productClass'] || parameters['productClass'];

        if (parameters['productClass'] !== undefined) {
            queryParameters['productClass'] = parameters['productClass'];
        }

        if (parameters['productClass'] === undefined) {
            return throwError(new Error('Missing required  parameter: productClass'));
        }

        // allow use of param with or without underscore
        parameters['shipNode'] = parameters['shipNode'] || parameters['shipNode'];

        if (parameters['shipNode'] !== undefined) {
            queryParameters['shipNode'] = parameters['shipNode'];
        }

        if (parameters['shipNode'] === undefined) {
            return throwError(new Error('Missing required  parameter: shipNode'));
        }

        // allow use of param with or without underscore
        parameters['deliveryMethod'] = parameters['deliveryMethod'] || parameters['deliveryMethod'];

        if (parameters['deliveryMethod'] !== undefined) {
            queryParameters['deliveryMethod'] = parameters['deliveryMethod'];
        }

        if (parameters['deliveryMethod'] === undefined) {
            return throwError(new Error('Missing required  parameter: deliveryMethod'));
        }

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

        const obsToReturn$ = this.http.patch(url, this.resourceDomain, queryParameters, body, this.options);

        return obsToReturn$;
    }
    /**
    * Removing the fulfillment option level for the matching item criteria. Inherited value will be considered during inventory calculation when the exact match is not defined.

    * @method
    * @name Item#deleteByTenantIdV1ConfigurationItemsByItemIdFulfillmentOptions
         * @param {string} unitOfMeasure - The unit of measure in the context of the item's quantity. For example, 1 `DOZEN` egg or 2.7 `YARD` of fabric.
         * @param {string} productClass - A means of describing the quality of inventory for the item. For example, OPEN_BOX to represent open box inventory.
         * @param {string} shipNode - The ship node associated with the item.
         * @param {string} deliveryMethod - Indicates the delivery method specified for an item. Use `SHP` when the item should be fulfilled via shipping. Use `PICK` when the item should be picked up from store.

         * @param {string} tenantId - The tenant ID provided by IBM to access your APIs.
         * @param {string} itemId - The unique identifier of an item.
    */
    public deleteByTenantIdV1ConfigurationItemsByItemIdFulfillmentOptions(parameters: {
        'unitOfMeasure': string,
        'productClass': string,
        'shipNode': string,
        'deliveryMethod': "SHP" | "PICK",
        'tenantId': string,
        'itemId': string,
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
        let path = '/{tenantId}/v1/configuration/items/{itemId}/fulfillment_options'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['unitOfMeasure'] = parameters['unitOfMeasure'] || parameters['unitOfMeasure'];

        if (parameters['unitOfMeasure'] !== undefined) {
            queryParameters['unitOfMeasure'] = parameters['unitOfMeasure'];
        }

        if (parameters['unitOfMeasure'] === undefined) {
            return throwError(new Error('Missing required  parameter: unitOfMeasure'));
        }

        // allow use of param with or without underscore
        parameters['productClass'] = parameters['productClass'] || parameters['productClass'];

        if (parameters['productClass'] !== undefined) {
            queryParameters['productClass'] = parameters['productClass'];
        }

        if (parameters['productClass'] === undefined) {
            return throwError(new Error('Missing required  parameter: productClass'));
        }

        // allow use of param with or without underscore
        parameters['shipNode'] = parameters['shipNode'] || parameters['shipNode'];

        if (parameters['shipNode'] !== undefined) {
            queryParameters['shipNode'] = parameters['shipNode'];
        }

        if (parameters['shipNode'] === undefined) {
            return throwError(new Error('Missing required  parameter: shipNode'));
        }

        // allow use of param with or without underscore
        parameters['deliveryMethod'] = parameters['deliveryMethod'] || parameters['deliveryMethod'];

        if (parameters['deliveryMethod'] !== undefined) {
            queryParameters['deliveryMethod'] = parameters['deliveryMethod'];
        }

        if (parameters['deliveryMethod'] === undefined) {
            return throwError(new Error('Missing required  parameter: deliveryMethod'));
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

        const obsToReturn$ = this.http.delete(url, this.resourceDomain, queryParameters, body, this.options);

        return obsToReturn$;
    }
}

export {
    ItemService,

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
    CreateDemandType,
}