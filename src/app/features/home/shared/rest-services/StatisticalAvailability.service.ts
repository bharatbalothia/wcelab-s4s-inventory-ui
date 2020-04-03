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

import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { BucCommBEHttpWrapperService } from '@buc/svc-angular';

type GetNodeAvailabilityRequest = {
    'lines': Array < GetNodeAvailabilityRequestLine >
        | GetNodeAvailabilityRequestLine

    'segment' ? : string

    'segmentType' ? : string

};
type GetNodeAvailabilityRequestLine = {
    'lineId': string

    'itemId': string

    'unitOfMeasure' ? : string

    'segment' ? : string

    'productClass' ? : string

    'deliveryMethod': string

    'demandType' ? : string

    'shipNodes': Array < string >
        | string

};
type GetOMSInventoryAvailabilityRequest = {
    'OrganizationCode': string
    'PromiseLines': GetOMSInventoryAvailabilityRequestLine
};
type GetOMSInventoryAvailabilityRequestLine = {
	'PromiseLine': Array < GetOMSInventoryAvailabilityPromiseLine >
        | GetOMSInventoryAvailabilityPromiseLine
};
type GetOMSInventoryAvailabilityPromiseLine = {
	'DeliveryMethod' : string
	'ItemID' : string
	'LineId' : string
	'ShipNode' : string
	'UnitOfMeasure' : string
};
type GetNodeAvailabilityResponse = {
    'lines' ? : Array < GetNodeAvailabilityResponseLine >
        | GetNodeAvailabilityResponseLine

};
type GetNodeAvailabilityResponseLine = {
    'lineId' ? : string

    'itemId' ? : string

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'deliveryMethod' ? : string

    'demandType' ? : string

    'shipNodeAvailability' ? : Array < ShipNodeAvailability >
        | ShipNodeAvailability

};
type ShipNodeAvailability = {
    'earliestShipTs' ? : string

    'futureEarliestShipTs' ? : string

    'futureLatestShipTs' ? : string

    'onhandSafetyQuantity' ? : number

    'futureSafetyQuantity' ? : number

    'futureAvailableQuantity' ? : number

    'safetyQuantity' ? : number

    'onhandAvailableQuantity' ? : number

    'shipNode' ? : string

    'totalAvailableQuantity' ? : number

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
class StatisticalAvailabilityService {

    private domain: string
    private resourceDomain: string
    private options: any

    constructor(private http: BucCommBEHttpWrapperService) {
        this.resourceDomain = 'inventory_buc'
        this.domain = BucCommBEHttpWrapperService.getPathPrefix(this.resourceDomain)
        this.options = BucCommBEHttpWrapperService.getRequestOptions(this.resourceDomain)
    }

    /**
    * Provides the current availability picture, including non-expired reservations, at the node level. Responds with availability based on requested nodes.

    * @method
    * @name StatisticalAvailability#postByTenantIdV1AvailabilityNode
         * @param {} body - Input JSON
         * @param {string} tenantId - The IBM provided tenant ID to access your APIs.
    */
    public postByTenantIdV1AvailabilityNode(parameters: {
        'body': GetNodeAvailabilityRequest,
        'tenantId': string,
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
        let path = '/{tenantId}/v1/availability/node'

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
}

export {
    StatisticalAvailabilityService,

    GetNodeAvailabilityRequest,
    GetNodeAvailabilityRequestLine,
    GetOMSInventoryAvailabilityRequest,
    GetOMSInventoryAvailabilityRequestLine,
	GetOMSInventoryAvailabilityPromiseLine,
    GetNodeAvailabilityResponse,
    GetNodeAvailabilityResponseLine,
    ShipNodeAvailability,
    AuthenticationError,
    AccessForbiddenError
}
