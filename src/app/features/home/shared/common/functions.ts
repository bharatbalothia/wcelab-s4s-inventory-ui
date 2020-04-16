import { SupplierLocation } from './supplierLocation';
import { SupplyRequestSkuDescriptor } from '../services/inventory-supply.service';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';

/**
 * * if `raw` is an array, return it as-is
 * * if it exists, return it as 1-element array
 * * otherwise, return an empty array
 * @param raw object to check
 */
export const getArray = (raw: any) => {
  return Array.isArray(raw) ? raw : raw ? [ raw ] : [];
};

export const getString = (raw: string, def: string = '') => {
  return raw || def;
};

export const getItemUniqueKey = (itemId, uom, pc) => {
  return `${itemId}_::_${uom}_::_${pc}`;
};

export const buildShipLocations = (resp): { list: Array<SupplierLocation>, map: { [ key: string ]: SupplierLocation } } => {
  const rc = { list: [], map: {} };
  rc.list = getArray(resp)
  .map(shipNode => {
    const sn: SupplierLocation = {
      shipnode_id: shipNode.shipnode_id,
      _id: shipNode._id,
      shipnode_name: shipNode.shipnode_name,
      latitude: shipNode.latitude,
      longitude: shipNode.longitude,
      supplier_id: shipNode.supplier_id
    };
    rc.map[sn.shipnode_id] = sn;
    return sn;
  });
  return rc;
};

export const makeSupplyRequest = (itemId, unitOfMeasure, productClass): SupplyRequestSkuDescriptor => {
  const rc: SupplyRequestSkuDescriptor = {
    itemId,
    unitOfMeasure,
    productClass,
    key: getItemUniqueKey(itemId, unitOfMeasure, productClass)
  };
  return rc;
}