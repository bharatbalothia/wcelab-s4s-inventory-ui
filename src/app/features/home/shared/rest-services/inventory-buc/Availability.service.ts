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

    'productClass' ? : string

    'deliveryMethod': string

    'demandType' ? : string

    'shipNodes': Array < string >
        | string

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
type GetNodeAvailabilityBreakupRequest = {
    'lines': Array < GetNodeAvailabilityBreakupRequestLine >
        | GetNodeAvailabilityBreakupRequestLine

};
type GetNodeAvailabilityBreakupRequestLine = {
    'lineId': string

    'itemId': string

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'deliveryMethods': Array < string >
        | string

    'shipNodes': Array < string >
        | string

};
type GetNodeAvailabilityBreakupResponse = {
    'lineTotalSupplyQuantity' ? : number

    'lineTotalOnhandAvailableQuantity' ? : number

    'lines' ? : Array < GetNodeAvailabilityBreakupResponseLine >
        | GetNodeAvailabilityBreakupResponseLine

};
type GetNodeAvailabilityBreakupResponseLine = {
    'lineId' ? : string

    'itemId' ? : string

    'unitOfMeasure' ? : string

    'productClass' ? : string

    'shipNodes' ? : Array < string >
        | string

    'totalOnhandSupplyQuantity' ? : number

    'totalDemandQuantity' ? : number

    'totalReservedQuantity' ? : number

    'minTotalOnhandAvailableQuantity' ? : number

    'deliveryMethodBreakup' ? : Array < DeliveryMethodBreakup >
        | DeliveryMethodBreakup

};
type DeliveryMethodBreakup = {
    'deliveryMethod' ? : string

    'totalOnhandAvailableQuantity' ? : number

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
class BUCInvAvailabilityService {

    private domain: string
    private resourceDomain: string
    private options: any

    constructor(private http: BucCommBEHttpWrapperService) {
        this.resourceDomain = 'inventory_buc'
        this.domain = BucCommBEHttpWrapperService.getPathPrefix(this.resourceDomain)
        this.options = BucCommBEHttpWrapperService.getRequestOptions(this.resourceDomain)
    }
    
    /**
    * Provides the node availability breakup details Safety quantity, Demands, Supplies and Reservations that impact the availability , at the item level. Responds with availability breakup based on requested nodes.

    * @method
    * @name Availability#postByTenantIdV1AvailabilityNodeBreakup
         * @param {} body - Input JSON
         * @param {string} tenantId - The IBM provided tenant ID to access your APIs.
    */
    public postByTenantIdV1AvailabilityNodeBreakup(parameters: {
        'body': GetNodeAvailabilityBreakupRequest,
        'tenantId': string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }){

        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        let path = '/{tenantId}/v1/availability/node/breakup'

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
    BUCInvAvailabilityService,

    GetNodeAvailabilityRequest,
    GetNodeAvailabilityRequestLine,
    GetNodeAvailabilityResponse,
    GetNodeAvailabilityResponseLine,
    ShipNodeAvailability,
    GetNodeAvailabilityBreakupRequest,
    GetNodeAvailabilityBreakupRequestLine,
    GetNodeAvailabilityBreakupResponse,
    GetNodeAvailabilityBreakupResponseLine,
    DeliveryMethodBreakup,
    AuthenticationError,
    AccessForbiddenError,
}