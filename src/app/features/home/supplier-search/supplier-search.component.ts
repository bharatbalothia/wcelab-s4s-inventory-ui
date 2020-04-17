import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Constants } from '../shared/common/constants';
import { S4STableModel } from '../shared/common/table-model';
import { TableHeaderItem, ComboBox } from 'carbon-components-angular';
import { TranslateService } from '@ngx-translate/core';
import { S4SSearchService } from '../shared/rest-services/S4SSearch.service';
import { forkJoin } from 'rxjs';
import { buildShipLocations, makeSupplyRequest } from '../shared/common/functions';
import { ComboboxComponent, COMMON } from '@buc/common-components';
import { SupplierLocation } from '../shared/common/supplierLocation';
import { SKU } from '../shared/common/sku';
import { InventorySupplyService } from '../shared/services/inventory-supply.service';

@Component({
  selector: 'app-supplier-search',
  templateUrl: './supplier-search.component.html',
  styleUrls: ['./supplier-search.component.scss'],
})
export class SupplierSearchComponent implements OnInit {
  @ViewChild('supplierCombo', { static: true }) private supplierCombo: ComboboxComponent;
  @ViewChild('listCombo', { static: true }) private listCombo: ComboboxComponent;
  private readonly nlsMap: any = {
    'ss.LABEL_searchBy': '',
    'ss.LABEL_location': '',
    'ss.LABEL_model': '',
    'ss.LABEL_sku': '',
    'ss.LABEL_supply': '',
    'ss.LABEL_date': '',
    'ss.LABEL_selectLocation': '',
    'ss.LABEL_selectSKU': ''
  };
  private readonly productClass = Constants.PC_NEW;

  private supplier: string;
  private last: string;
  private asMap: { [ key: string ]: { locs: Array<SupplierLocation>, skus: Array<SKU> } } = {};
  @HostBinding('class') page = 'page-component';
  user: { buyers: string[], sellers: string[] };
  model: S4STableModel = new S4STableModel();
  searchType: number = Constants.SS_LOCATION;
  listDisplay: { label: string, ph: string } = { label: '', ph: '' };
  skuList: any[] = [];
  locList: any[] = [];
  ddList: any[] = [];
  supplierList: any[] = [];
  typeRadios: Array<SearchTypeDescriptor> = [];
  initialized: boolean = false;

  constructor(
    private translateSvc: TranslateService,
    private s4sSvc: S4SSearchService,
    private ivSuppSvc: InventorySupplyService
  ) {
  }

  ngOnInit() {
    this._init();
  }

  onSearchType(event: SearchTypeDescriptor) {
    const t = event.value;
    if (t !== this.searchType) {
      this.searchType = t;
      this.last = undefined;
      this._loadList();
    }
  }

  onList(e) {
    const i = e.item ? e.item.id : undefined;
    if (i && i !== this.last) {
      this.last = i;
      if (Constants.SS_LOCATION === this.searchType) {
        this._getSKUsForLocation(e.item.node);
      } else {
        this._getLocationsForSKU(e.item.sku);
      }
    } else {
      this.last = undefined;
      this._loadTable([]);
    }
  }

  onSupplier(e) {
    const s = e.item ? e.item.id : undefined;
    if (s && s !== this.supplier) {
      this.supplier = s;
      this._loadList();
    } else {
      [ this.supplierCombo, this.listCombo ].forEach(c => this._clearCarbonCombo(c.comboBox));
      this.ddList = [];
      this.supplier = undefined;
      this.last = undefined;
      this._loadTable([]);
    }
  }

  private async _init() {
    await this._initTranslations();
    await this._initUserData();
    this._initSearchType();
    this._setDisplay(this.nlsMap['ss.LABEL_sku'], this.nlsMap['ss.LABEL_location'], this.nlsMap['ss.LABEL_selectLocation']);
    if (this.user.sellers.length === 1) {
      this.onSupplier({ item: this.supplierList[0] });
    }
    this.initialized = true;
  }

  private async _loadList() {

    if (Constants.SS_LOCATION === this.searchType) {
      this._setDisplay(this.nlsMap['ss.LABEL_sku'], this.nlsMap['ss.LABEL_location'], this.nlsMap['ss.LABEL_selectLocation']);
    } else {
      this._setDisplay(this.nlsMap['ss.LABEL_location'], this.nlsMap['ss.LABEL_sku'], this.nlsMap['ss.LABEL_selectSKU']);
    }

    if (this.supplier) {
      this._clearCarbonCombo(this.listCombo.comboBox);
      this.ddList = [];
      this._loadTable([]);

      if (Constants.SS_LOCATION === this.searchType) {
        this._setDisplay(this.nlsMap['ss.LABEL_sku'], this.nlsMap['ss.LABEL_location'], this.nlsMap['ss.LABEL_selectLocation']);
        const rc = await this._getLocations();
        this.ddList = rc.map(s => ({
          content: this._nodeDesc(s),
          id: s.shipnode_id,
          node: s
        }));
      } else {
        this._setDisplay(this.nlsMap['ss.LABEL_location'], this.nlsMap['ss.LABEL_sku'], this.nlsMap['ss.LABEL_selectSKU']);
        const rc = await this._getSKUs();
        this.ddList = rc.filter(p => !p.category).map(p => ({
          content: this._skuDesc(p),
          id: p.item_id,
          sku: p
        }));
      }
    }
  }

  private async _initTranslations() {
    const keys = Object.keys(this.nlsMap);
    const json = await this.translateSvc.get(keys).toPromise();
    keys.forEach(k => this.nlsMap[k] = json[k]);
  }

  private _initTable(first: string) {
    this.model.header = [
      [
        new TableHeaderItem({ data: first, sortable: true }),
        new TableHeaderItem({ data: this.nlsMap['ss.LABEL_supply'], sortable: true }),
        new TableHeaderItem({ data: this.nlsMap['ss.LABEL_date'], sortable: true })
      ]
    ];
  }

  private _loadTable(records: any[]) {
    this.model.isLoading = true;
    this.model.setPgDefaults();
    this.model.populate(records, {});
    this.model.isLoading = false;
  }

  private async _initUserData() {
    this.user = await this.s4sSvc.getUserInfo().toPromise();
    const obs = this.user.sellers.map(supplierId => this.s4sSvc.getContactDetailsOfSelectedSupplier({ supplierId }));
    const suppliers = await forkJoin(obs).toPromise();
    this.supplierList = suppliers.map(s => ({ content: `${s.description} (${s.supplier_id})`, id: s.supplier_id }));
  }

  private _initSearchType() {
    const list = [
      { value: Constants.SS_LOCATION, content: this.nlsMap['ss.LABEL_location'], checked: true },
      { value: Constants.SS_MODEL, content: this.nlsMap['ss.LABEL_model']}
    ];
    this.typeRadios = list;
  }

  private _setDisplay(col: string, label: string, ph: string) {
    this.listDisplay.label = label;
    this.listDisplay.ph = ph;
    this._initTable(col);
  }

  private _getOrPutCacheForSupplier(s: string) {
    let obj = this.asMap[s];
    if (!obj) {
      obj = { locs: undefined, skus: undefined };
      this.asMap[s] = obj;
    }
    return obj;
  }

  private async _getSKUs(): Promise<SKU[]> {
    const obj = this._getOrPutCacheForSupplier(this.supplier);
    let rc = obj.skus;
    if (!rc) {
      rc = await this.s4sSvc.getProducts({}).toPromise();
      // should we filter out products by supplier?
      // const re = new RegExp(`^${this.supplier}::.+$`);
      // rc = rc.filter(i => i.item_id.match(re));
      obj.skus = rc;
    }
    return rc;
  }

  private async _getLocations(): Promise<SupplierLocation[]> {
    const obj = this._getOrPutCacheForSupplier(this.supplier);
    let rc = obj.locs;
    if (!rc) {
      const resp = await this.s4sSvc.getShipNodesForSupplier({ supplierId: this.supplier }).toPromise();
      rc =  buildShipLocations(resp).list;
      obj.locs = rc;
    }
    return rc;
  }

  private async _getSKUsForLocation(node: SupplierLocation) {
    this.model.isLoading = true;

    const resp = await this._getSKUs();
    const skus = resp.map(s => {
      const rc = makeSupplyRequest(s.item_id, s.unit_of_measure || 'UNIT', s.productClass || this.productClass);
      const aux: any = rc;
      aux.item_id = rc.itemId;
      aux.description = s.description;
      return rc;
    });
    let total = 0;
    const records = [];
    const key2Sku = COMMON.toMap(skus, 'key');

    const supplies = await this.ivSuppSvc.getMultiSkuSupplyByNodes(skus, [ node.shipnode_id ]).toPromise();
    supplies.filter(s => s.supply.length > 0)
    .forEach(line => {
      const sku = key2Sku[line.sku.key];
      const supp = line.supply.pop();
      const shipNodeLocation = node.shipnode_name || node.shipnode_id;
      total += supp.quantity;
      records.push({
        shipNodeLocation,
        sku: sku.itemId,
        skuDesc: this._skuDesc(sku),
        availableQuantity: supp.quantity,
        latitude: node.latitude,
        longitude: node.longitude
      });
    });

    const rows = records
    .map(record => ([
      { data: record.skuDesc, id: record.sku },
      { data: record.availableQuantity },
      { data: Constants.NOW }
    ]));
    this._loadTable(rows);

    this.model.isLoading = false;
  }

  private async _getLocationsForSKU(sku: SKU) {
    this.model.isLoading = true;

    const locs = await this._getLocations();
    const m = {};
    const nodes = locs.map(l => { m[l.shipnode_id] = l; return l.shipnode_id; });
    const records = [];
    let total = 0;
    const req = [ makeSupplyRequest(sku.item_id, sku.unit_of_measure || 'UNIT', sku.productClass || this.productClass) ];
    const supplies = await this.ivSuppSvc.getMultiSkuSupplyByNodes(req, nodes).toPromise();

    supplies.filter(s => s.supply.length > 0)
    .forEach(line => {
      line.supply.forEach(supp => {
        const node = m[supp.shipNode];
        const name = node ? node.shipnode_name : undefined;
        const shipNodeLocation = name || supp.shipNode;
        total += supp.quantity;
        records.push({
          shipNodeLocation,
          sku: sku.item_id,
          skuDesc: this._skuDesc(sku),
          availableQuantity: supp.quantity,
          latitude: node ? node.latitude : undefined,
          longitude: node ? node.longitude : undefined
        });
      });
    });

    const rows = records
    .map(record => ([
      { data: record.shipNodeLocation, id: record.shipNodeLocation },
      { data: record.availableQuantity },
      { data: Constants.NOW }
    ]));
    this._loadTable(rows);

    this.model.isLoading = false;
  }

  private _clearCarbonCombo(carbon: ComboBox) {
    carbon.selectedValue = '';
    carbon.showClearButton = false;
  }

  private _skuDesc(sku: any) {
    return `${sku.description} (${sku.item_id.replace(/^.+?::/, '')})`;
  }

  private _nodeDesc(node: SupplierLocation) {
    return `${node.shipnode_name} (${node.shipnode_id.replace(/^.+?::/, '')})`;
  }
}

interface SearchTypeDescriptor {
  value: number;
  content: string;
  checked?: boolean;
}
