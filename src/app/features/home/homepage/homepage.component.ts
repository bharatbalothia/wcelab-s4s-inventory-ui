import { Component, OnInit, ViewChild, TemplateRef, HostBinding, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

import { COMMON, ComboboxComponent,BucNotificationModel, BucNotificationService } from '@buc/common-components';
import { TableHeaderItem, ModalService, ComboBox, NotificationService } from 'carbon-components-angular';
import { InventoryAvailabilityService } from '../shared/services/inventory-availability.service';
import { InventoryDistributionService } from '../shared/services/inventory-distribution.service';
import { S4SSearchService } from '../shared/rest-services/S4SSearch.service';
import { forkJoin } from 'rxjs';
import { getArray } from '../shared/common/functions';


import { InfoModalComponent } from '../shared/components/info-modal/info-modal.component';
import { Supplier } from '../shared/common/supplier';
import { SupplierLocation } from '../shared/common/supplierLocation';
import { Product } from '../shared/common/product';
import { SKU } from '../shared/common/sku';
import { S4STableModel } from '../shared/common/table-model';
import { Constants } from '../shared/common/constants';

import { environment } from '../../../../environments/environment';


// PENDING - 1 - Need additonal logic to see the logged in users timezone
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  @ViewChild('supplierLink', { static: true }) private supplierLink: TemplateRef<any>;
  @ViewChild('supplierTpl', { static: true }) private supplierTpl: TemplateRef<any>;
  @ViewChild('supplierLocationLink', { static: true }) private supplierLocationLink: TemplateRef<any>;
  @ViewChild('locationTpl', { static: true }) private locationTpl: TemplateRef<any>;
  @ViewChild('products', { static: true }) private products: ComboboxComponent;
  @ViewChild('categories', { static: true }) private categories: ComboboxComponent;
  @ViewChild('modelnumbers', { static: true }) private modelnumbers: ComboboxComponent;
  // @ViewChild('suppliers', { static: true }) private suppliers: ComboboxComponent; from HTML it was removed.




  private nlsMap: any = {
    'common.LABEL_supplierDetails': '',
    'common.LABEL_supplierLocation': '',
    'common.LABEL_ok': '',
    'common.LABEL_noContact': '',
    'common.LABEL_noPhone': '',
    'common.LABEL_none': '',
    'common.LABEL_new': '',
    'common.LABEL_used': '',
    'common.LABEL_showMap': '',
    'common.LABEL_showTable': '',
    'ERROR.ERR_USER_NOTSET':'',
  };

  private supplierMap: { [key: string]: Supplier } = {};
  supplierList: any[] = [];
  private skuMap: { [key: string]: SKU } = {};
  private supplierLocationMap: { [key: string]: SupplierLocation } = {};
  private cat2ProdMap: { [key: string]: any } = {};

  private selectedCat: string;
  private selectedProd: Product = { item_id: undefined, description: undefined };
  private selectedPc: string = 'NEW';
  private supplierSingleton: number = 0;
  private supplierSkuSingleton: number = 0;

  isSearchByModelNo = false;
  private lastSearchedModelNumbers;
  private lastSelectedSuppliers;

  private bucNS: BucNotificationService = new BucNotificationService();

  isGoogleMapEnabled = false;

  user: { buyers: string[], suppliers: string[], connected_suppliers: string[] };

  @HostBinding('class') page = 'page-component';
  isScreenInitialized = false;
  model = new S4STableModel();
  categoryListValues = [];
  modelNumberListValues = [];
  selectedModelNumbers = [];
  selectedSuppliers = [];

  productListValues = [];
  pcRadios = [];
  initialized: boolean = false;
  constructor(
    private translateService: TranslateService,
    private invAvailService: InventoryAvailabilityService,
    private invDistService: InventoryDistributionService,
    private modalSvc: ModalService,
    private translateSvc: TranslateService,
    private s4sSvc: S4SSearchService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit() {
    this.isGoogleMapEnabled = environment.isGoogleMapEnabled;
    this._init();
  }

  private async _init() {
    await this._initTranslations();
    this._initializePage();

  }

  private async _initTranslations() {
    const keys = Object.keys(this.nlsMap);
    const json = await this.translateSvc.get(keys).toPromise();
    keys.forEach(k => this.nlsMap[k] = json[k]);
  }

  private async _initializePage() {
    this.model.setPgDefaults();
    this._initPcTypes();
    this._initCategories();
    this.supplierList = [];

    await this._initUserDataAndFetchAllSuppliers();
    await this._initModelNumber();
    this.initialized = true;

    this._refreshSupplierTableHeader(false);
    this.isSearchByModelNo = false;
    this.selectedModelNumbers = [];
    this.selectedSuppliers = [];
    this.lastSearchedModelNumbers = [];
    this.lastSelectedSuppliers = [];
  }

  private async _initUserDataAndFetchAllSuppliers() {
    const getValue = (attr, def = '-') => {
      return attr ? attr.value : def;
    };

    this.user = await this.s4sSvc.getUserInfo().toPromise();
    console.log('S4S response - _initUserDataAndFetchAllSuppliers - getUserInfo', this.user);

    if (this.user !== undefined && this.user.connected_suppliers !== undefined && this.user.connected_suppliers.length > 0) {
      const obs = this.user.connected_suppliers.map(supplierId => this.s4sSvc.getContactDetailsOfSelectedSupplier({ supplierId }));
      const suppliers = await forkJoin(obs).toPromise();
      console.log('S4S response - _initUserDataAndFetchAllSuppliers - getContactDetailsOfSelectedSupplier combined', suppliers);

      this.supplierList = suppliers.map(s => ({ content: `${s.description} (${s.supplier_id})`, id: s.supplier_id }));

      getArray(suppliers).forEach((supplier) => {
        // const attrMap: { [key: string]: { value: string } } = COMMON.toMap(supplier.address_attributes, 'name');
        const s: Supplier = {
          _id: supplier._id,
          supplier_id: supplier.supplier_id,
          description: supplier.description,
          descAndNode: '',
          supplier_type: supplier.supplier_type,
          url: supplier.supplier_url || '',
          contactPerson: supplier.contact_person || this.nlsMap['common.LABEL_noContact'],
          // address_line_1: getValue(attrMap.address_line_1),
          // city: getValue(attrMap.city),
          // state: getValue(attrMap.state),
          // zipcode: getValue(attrMap.zipcode),
          // country: getValue(attrMap.country),
          // phoneNumber: getValue(attrMap.phone_number, this.nlsMap['common.LABEL_noPhone'])
          address_line_1: supplier.contact.address_line_1,
          city: supplier.contact.city,
          state: supplier.contact.state,
          zipcode: supplier.contact.zipcode,
          country: supplier.contact.country,
          phoneNumber: supplier.contact.phone_number || this.nlsMap['common.LABEL_noPhone']
        };
        this.supplierMap[s.supplier_id] = s;
      });
      console.log('Model - _initUserDataAndFetchAllSuppliers S4S supplierList ', this.supplierList);
      console.log('Model - _initUserDataAndFetchAllSuppliers S4S supplierMap ', this.supplierMap);
    }
    else {
      this._showError(this.nlsMap['ERROR.ERR_USER_NOTSET'],true);
    }
  }
  private _showError(msg, onShell = true) {
    this._showNotification('error', '', msg, false, onShell);
  }

  private _showNotification(type, title, message, showClose = false, onShell = true) {
    if (onShell) {
      const notification = new BucNotificationModel({ statusType: type, statusContent: message });
      this.bucNS.send([notification]);
    } else {
      this.notificationService.showNotification({ type, title, message, showClose });
    }
  }

  private _initPcTypes() {
    const list = [
      { value: Constants.PC_NEW, content: this.nlsMap['common.LABEL_new'], checked: true },
      { value: Constants.PC_USED, content: this.nlsMap['common.LABEL_used'] },
      { value: Constants.PC_NONE, content: this.nlsMap['common.LABEL_none'] },
    ];
    this.pcRadios = list;
  }

  private async _fetchAllSuppliers() {
    const getValue = (attr, def = '-') => {
      return attr ? attr.value : def;
    };
    const responses4s = await this.invDistService.fetchAllSuppliers().toPromise();
    console.log('S4S response - fetchAllSuppliers', responses4s);

    getArray(responses4s).forEach((supplier) => {
      // const attrMap: { [key: string]: { value: string } } = COMMON.toMap(supplier.address_attributes, 'name');
      const s: Supplier = {
        _id: supplier._id,
        supplier_id: supplier.supplier_id,
        description: supplier.description,
        descAndNode: '',
        supplier_type: supplier.supplier_type,
        url: supplier.supplier_url || '',
        contactPerson: supplier.contact_person || this.nlsMap['common.LABEL_noContact'],
        // address_line_1: getValue(attrMap.address_line_1),
        // city: getValue(attrMap.city),
        // state: getValue(attrMap.state),
        // zipcode: getValue(attrMap.zipcode),
        // country: getValue(attrMap.country),
        // phoneNumber: getValue(attrMap.phone_number, this.nlsMap['common.LABEL_noPhone'])
        address_line_1: supplier.contact.address_line_1,
        city: supplier.contact.city,
        state: supplier.contact.state,
        zipcode: supplier.contact.zipcode,
        country: supplier.contact.country,
        phoneNumber: supplier.contact.phone_number || this.nlsMap['common.LABEL_noPhone']
      };

      this.supplierMap[s.supplier_id] = s;
    });

    console.log('Model - S4S allSuppliers List ', this.supplierMap);
  }

  private async _fetchProductsById(childItems: string[]) {
    const obs = childItems.map(productId => this.s4sSvc.getProductsDetailsById({ productId }));
    const products = await forkJoin(obs).toPromise();
    products.forEach(product => {
      const s: SKU = {
        unit_of_measure: product.unit_of_measure,
        _id: product._id,
        item_id: product.item_id,
        description: product.description,
        category: product.category,
        image_url: product.image_url
      };
      this.skuMap[s.item_id] = s;
    });
    console.log('Model - S4S allProducts List ', this.skuMap);
  }

  private async _initCategories() {
    const responses4s = await this.invDistService.getAllCategories().toPromise();
    console.log('S4S response - getAllCategories ', responses4s);
    this.categoryListValues = getArray(responses4s).map((c) => ({
      content: c.category_description,
      id: c.category_id,
      selected: false
    }));
    console.log('Model - category List ', this.categoryListValues);
    this.isScreenInitialized = true;
  }

  private async _initModelNumber() {

    const obs = await this.s4sSvc.getAllProductsByUser().toPromise();

      this.modelNumberListValues = getArray(obs)
      .filter(p => (p.category === '' && this.supplierMap[p.supplier_id])).map(p => ({
        content: `${p.description} (${p.item_id.replace(/^.+?::/, '')})`,
        id: p.item_id,
        selected: false
      }));
  }


  /**
   * called when product-class radio clicked
   * @param event event that was checked
   */
  async onPC(event: { value: string }) {
    const pc = Constants.PC_MAP[event.value];
    if (pc !== undefined && pc !== this.selectedPc) {
      this.selectedPc = pc;
      this._fetchSuppliersForProductAndClass();
    }
  }

  /**
   * Called when category selected from category dropdown
   * Padman: Fetch All Products By Category
   * @param event category-id container
   */
  public async onCategory(event) {
    const cat = event.item ? event.item.id : undefined;
    console.log('User selected Category ', cat);

    if (cat === undefined || cat !== this.selectedCat) {
      this.selectedCat = cat;
      this.selectedProd.item_id = undefined;
      this.productListValues = [];
      this._clearCarbonCombo(this.products.comboBox);

      try {
        this.model.isLoading = true;

        // reset table
        this._refreshSupplierTable([]);

        if (cat !== undefined) {
          // try to use cache, otherwise fetch
          let responses4s = this.cat2ProdMap[cat];
          if (!responses4s) {
            responses4s = await this.invDistService.getAllProductsByCategoryId(cat).toPromise();
            this.cat2ProdMap[cat] = responses4s;
          }

          console.log('S4S response of all products with in selected category id ', cat, responses4s);
          this.productListValues = getArray(responses4s).map((product) => ({
            content: `${product.description} (${product.item_id})`,
            id: product.item_id
          }));
          console.log('Model - Product List ', this.productListValues);
        }

        this.model.isLoading = false;
      } catch (err) {
        console.log('Error fetching availability: ', err);
      }
    }
  }


  /**
   * Called when user select options from 'model number' multi select combobox
   * @param event Model-Number-selection container
   */
  public async onModelNumber(event) {
    this.selectedModelNumbers = event;
    const currentModelIds = this.selectedModelNumbers.map(selectedModelNumber => selectedModelNumber.id.replace(/^.+?::/, ''));
    this.modelnumbers.comboBox.selectedValue = currentModelIds.join(', ');
    console.log('selectedModelNumbers --->', this.selectedModelNumbers);
  }

  /**
   * Called when user change supplier dropdown (Search by Model# view).
   * Selected Supplier ids will be used as a filter while making network availability IV call
   * @param event supplier-id-selection container
   */
  public async onSupplierDropdownChange(event) {
    this.selectedSuppliers = event;
    const supplierNames = this.selectedSuppliers.map(s => s.content);
    // this.suppliers.comboBox.selectedValue = supplierNames.join(', ');
    console.log('applied filter on supplier  -->', this.selectedSuppliers);
  }

  /**
   * Called when user click on the button 'search by model number'
   * @param event Model-Number-selection container
   */
  searchSuppliersByModelNumber(event) {
    let isModelSelectionSame = false;
    let isSupplierSelectionSame = false;

    if (this.lastSearchedModelNumbers.length === 0 || this.lastSearchedModelNumbers.length !== this.selectedModelNumbers.length) {
      this.lastSearchedModelNumbers = this.selectedModelNumbers;
    } else {
      isModelSelectionSame = this.isSelectionUnchanged(this.lastSearchedModelNumbers, this.selectedModelNumbers);
    }

    if (this.lastSelectedSuppliers.length === 0 || this.lastSelectedSuppliers.length !== this.selectedSuppliers.length) {
      this.lastSelectedSuppliers = this.selectedSuppliers;
    } else {
      isSupplierSelectionSame = this.isSelectionUnchanged(this.lastSelectedSuppliers, this.selectedSuppliers);
    }

    if (isModelSelectionSame && isSupplierSelectionSame) {
      return;
    }

    this._fetchSuppliersForMultipleProductAndClass();
  }

  private isSelectionUnchanged(previousSelections, currentSelections): boolean {

    const previousIds = previousSelections.map(previousSelection => previousSelection.id);
    const currentIds = currentSelections.map(currentSelection => currentSelection.id);

    if (previousIds.length !== currentIds.length) {
      return false;
    }
    const isSame = previousIds.every((element, index) => {
      return element === currentIds[index];
    });
    console.log('previousIds, currentIds, isSame ', previousIds, currentIds, isSame);

    return isSame;
  }

  /**
   * Called when product selected from product dropdown
   * Fetch Supplier for searched product id starts
   * Padman: Get Availability & Date Group by Supplier For user selected ProductId
   * @param event product-id container
   */
  public async onProduct(event) {
    const id = event.item ? event.item.id : undefined;
    console.log('User selected Product ', id);
    if (id === undefined || id !== this.selectedProd.item_id) {
      this.selectedProd.item_id = id;
      this._refreshSupplierTable([]);
      if (id === undefined) {
        this._clearCarbonCombo(this.products.comboBox);
      } else {
        this.selectedProd.description = event.item.content;
        this._fetchSuppliersForProductAndClass();
      }
    }
  }

  private _clearCarbonCombo(carbon: ComboBox) {
    carbon.selectedValue = '';
    carbon.showClearButton = false;
  }

  /**
   * fetch suppliers for selected product and product-class
   */
  private async _fetchSuppliersForProductAndClass() {
    if (!this.selectedProd.item_id) {
      return;
    }

    try {
      this.model.isLoading = true;

      const allSuppliersHavingSelectedProduct = [];
      const suppliers = Object.keys(this.supplierMap);

      const resp = await this.invAvailService.getConsolidatedInventorySameUOMSamePC(
        this.selectedProd.item_id, suppliers, 'UNIT', this.selectedPc
      ).toPromise();
      console.log('IV response ', resp);

      const lines = getArray(resp.lines)
        .filter(l => l.networkAvailabilities.length > 0 && l.networkAvailabilities[0].totalAvailableQuantity > 0);

      for (const line of lines) {
        console.log('line', line, line.networkAvailabilities[0].distributionGroupId);
        const supplier = this.supplierMap[line.networkAvailabilities[0].distributionGroupId];
        supplier.descAndNode = `${supplier.description} (${line.networkAvailabilities[0].distributionGroupId})`;

        let availableDate = '';
        if (line.networkAvailabilities[0].futureAvailableQuantity > 0) {
          availableDate = new DatePipe('en-US').transform(line.networkAvailabilities[0].futureEarliestShipTs, 'MM/dd/yyyy');
          availableDate = ` (starts on  ${availableDate} )`;
        }

        allSuppliersHavingSelectedProduct.push({
          supplier,
          product: this.selectedProd,
          productClass: this.selectedPc,
          productOnHandAvailableQuantity: ((line.networkAvailabilities[0].onhandAvailableQuantity > 0) ?
            line.networkAvailabilities[0].onhandAvailableQuantity : '-'),
          productFutureAvailableQuantity: ((line.networkAvailabilities[0].futureAvailableQuantity > 0) ?
            line.networkAvailabilities[0].futureAvailableQuantity : '-'),
          Date: availableDate
          // TODO PENDING - 1
        });
      }

      this.model.isLoading = false;

      console.log('Model - allSuppliersHavingSelectedProduct', allSuppliersHavingSelectedProduct);
      this._refreshSupplierTable(allSuppliersHavingSelectedProduct);
    } catch (err) {
      console.log('Error fetching availability: ', err);
    }
  }


  /**
   * fetch suppliers for selected multiple products and product-class
   */
  private async _fetchSuppliersForMultipleProductAndClass() {
    if (this.selectedModelNumbers.length === 0) {
      return;
    }

    const searchSkuIds = [];
    const selectedSupplierIds = [];
    this.selectedModelNumbers.forEach(modelNumber => {
      searchSkuIds.push([modelNumber.id, modelNumber.content]);
    });


    this.selectedSuppliers.forEach(supplier => {
      selectedSupplierIds.push(supplier.id);
    });

    try {
      this.model.isLoading = true;

      const allSuppliersHavingSelectedProduct = [];
      let supplierIds = Object.keys(this.supplierMap);

      // filter suppliers based on selection from supplier dropdown.
      // In case if entitled to one supplier, then it is available in supplierIds
      if (selectedSupplierIds.length > 0) {
        supplierIds = selectedSupplierIds.slice();
      }
      console.log('searchSkuIds , supplierIds, selectedSupplierIds', searchSkuIds, supplierIds, selectedSupplierIds);
      for (const sku of searchSkuIds) {
        const resp = await this.invAvailService.getConsolidatedInventorySameUOMSamePC(
          sku[0], supplierIds, 'UNIT', this.selectedPc
        ).toPromise();
        console.log('IV response ', resp, sku);

        const lines = getArray(resp.lines)
          .filter(l => l.networkAvailabilities.length > 0 && l.networkAvailabilities[0].totalAvailableQuantity > 0);

        for (const line of lines) {
          console.log('line', line, line.networkAvailabilities[0].distributionGroupId);
          const supplier = this.supplierMap[line.networkAvailabilities[0].distributionGroupId];
          supplier.descAndNode = `${supplier.description} (${line.networkAvailabilities[0].distributionGroupId})`;

          let availableDate = '';
          if (line.networkAvailabilities[0].futureAvailableQuantity > 0) {
            availableDate = new DatePipe('en-US').transform(line.networkAvailabilities[0].futureEarliestShipTs, 'MM/dd/yyyy');
            availableDate = ` (starts on ${availableDate} )`;
          }

          allSuppliersHavingSelectedProduct.push({
            supplier,
            product: { item_id: sku[0], description: sku[1] },
            productClass: this.selectedPc,
            productOnHandAvailableQuantity: ((line.networkAvailabilities[0].onhandAvailableQuantity > 0) ?
              line.networkAvailabilities[0].onhandAvailableQuantity : '-'),
            productFutureAvailableQuantity: ((line.networkAvailabilities[0].futureAvailableQuantity > 0) ?
              line.networkAvailabilities[0].futureAvailableQuantity : '-'),
            Date: availableDate
            // TODO PENDING - 1
          });

        }

        this.model.isLoading = false;

        console.log('Model - allSuppliersHavingSelectedProduct', allSuppliersHavingSelectedProduct);
        this._refreshSupplierTable(allSuppliersHavingSelectedProduct, true);
      }

    } catch (err) {
      console.log('Error fetching availability: ', err);
    }
  }

  private _refreshSupplierTableHeader(includeSkuColumn?) {
    if (includeSkuColumn !== undefined && includeSkuColumn) {
      this.model.header = [
        [
          new TableHeaderItem({
            data: this.translateService.instant('LIST_TABLE.HEADER_SUPPLIER'),
            sortable: true
          }),
          new TableHeaderItem({
            data: this.translateService.instant('LIST_TABLE.PRODUCT_MODEL_NUMBER'),
            sortable: true
          }),
          new TableHeaderItem({
            data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY_NOW'),
            sortable: true
          }),
          new TableHeaderItem({
            data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY_LATER'),
            sortable: true
          }),
          // new TableHeaderItem({
          //   data: this.translateService.instant('LIST_TABLE.HEADER_EARLIEST_AVAILABILITY_DATE'),
          //   sortable: true,
          // }),
        ]
      ];
    } else {
      this.model.header = [
        [
          new TableHeaderItem({
            data: this.translateService.instant('LIST_TABLE.HEADER_SUPPLIER'),
            sortable: true
          }),
          new TableHeaderItem({
            data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY_NOW'),
            sortable: true
          }),
          new TableHeaderItem({
            data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY_LATER'),
            sortable: true
          }),
          // new TableHeaderItem({
          //   data: this.translateService.instant('LIST_TABLE.HEADER_EARLIEST_AVAILABILITY_DATE'),
          //   sortable: true
          // }),
        ]
      ];
    }

  }

  private _refreshSupplierTable(data, includeSkuColumn?) {
    this.model.isLoading = true;
    if (includeSkuColumn !== undefined && includeSkuColumn) {
      const records = data.map((record, i) => [
        {
          data: { name: record.supplier.description, descriptor: record },
          template: this.supplierLink,
          id: i
        },
        {
          data: record.product.description,
        },
        {
          data: record.productOnHandAvailableQuantity,
        },
        {
          data: record.productFutureAvailableQuantity + record.Date,
        },
        // {
        //   data: record.Date
        // }
      ]);
      this.model.populate(records, { 0: 'name' });
    } else {
      const records = data.map((record, i) => [
        {
          data: { name: record.supplier.description, descriptor: record },
          template: this.supplierLink,
          id: i
        },
        {
          data: record.productOnHandAvailableQuantity,
        },
        {
          data: record.productFutureAvailableQuantity + record.Date,
        },
        // {
        //   data: record.Date
        // }
      ]);
      this.model.populate(records, { 0: 'name' });
    }

    this.model.setPgDefaults();
    this.model.isLoading = false;
  }



  /**
   * Called when supplier clicked in supplier-table from main page
   * @param data data-passed in from template
   */
  async onSupplier(data) {
    try {

      this.supplierSingleton++;
      console.log('supplierSingleton value on click for supplier ', this.supplierSingleton);
      if (this.supplierSingleton >= 2) {
        return;
      }
      const makeHeaders = () => [
        [
          new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.PRODUCT_MODEL_NUMBER') }),
          new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.UOM') }),
          new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY_NOW') }),
          new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY_LATER') }),
          // new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.HEADER_EARLIEST_AVAILABILITY_DATE') }),
        ]
      ];
      const makeRows = (records) => records
        .map(sku => ([
          {
            data: {
              sort: `${sku.itemDescription}:${sku.itemId}`,
              sku,
              supplier: data.supplier
            },
            template: this.supplierLocationLink, id: sku.itemId
          },
          { data: sku.unitOfMeasure, },
          { data: sku.itemOnHandAvailableQuantity },
          { data: sku.itemFutureAvailableQuantity + sku.itemAvailableDate },
          // { data: sku.itemAvailableDate }
        ]));

      const templateData: any = {
        supplier: data.supplier,
        product: data.product,
        quantity: data.Availability,
        onHandQuantity: data.itemOnHandAvailableQuantity,
        futureQuantity: data.itemFutureAvailableQuantity,
        // date: data.Date
      };


      const resp = await this.invAvailService.getInventoryForItemBySupplier(
        data.product.item_id, data.supplier.supplier_id, 'UNIT', data.productClass
      ).toPromise();

      const collection = [];
      const lines = getArray(resp.lines)
        .filter((line, i, self) =>
          line.networkAvailabilities.length > 0 &&
          line.networkAvailabilities[0].totalAvailableQuantity > 0 &&
          (self.length < 2 || line.itemId !== data.product.item_id)
        );

      const children = lines.filter(line => !this.skuMap[line.itemId]).map(line => line.itemId);
      if (children.length > 0) {
        await this._fetchProductsById(children);
      }

      let productAvailableQuantity = 0;
      const itemAvailableDates = [];
      lines.forEach(line => {
        const sku = this.skuMap[line.itemId];
        console.log('S4S response Child Item ', sku);
        if (sku && sku.unit_of_measure !== undefined) {

          let itemAvailableDate = '';
          if (line.networkAvailabilities[0].futureAvailableQuantity > 0) {
            itemAvailableDate = new DatePipe('en-US').transform(line.networkAvailabilities[0].futureEarliestShipTs, 'MM/dd/yyyy');
            itemAvailableDate = ` (starts on ${itemAvailableDate} )`;
          }
          itemAvailableDates.push(itemAvailableDate);
          productAvailableQuantity += line.networkAvailabilities[0].totalAvailableQuantity;
          collection.push(
            {
              itemId: sku.item_id,
              itemIdDisplay: sku.item_id.replace(/^.+?::/, ''),
              imgUrl: sku.image_url,
              parentData: { product: data.product, quantity: data.Availability, date: data.Date },
              itemDescription: sku.description,
              unitOfMeasure: sku.unit_of_measure,
              productClass: data.productClass,
              shipNodes: line.networkAvailabilities[0].distributionGroupId,
              availableQuantity: line.networkAvailabilities[0].totalAvailableQuantity,
              itemAvailableDate,
              itemOnHandAvailableQuantity: ((line.networkAvailabilities[0].onhandAvailableQuantity > 0) ?
                line.networkAvailabilities[0].onhandAvailableQuantity : '-'),
              itemFutureAvailableQuantity: ((line.networkAvailabilities[0].futureAvailableQuantity > 0) ?
                line.networkAvailabilities[0].futureAvailableQuantity : '-')
            }
          );
        }
      });

      // product AvailableQuantity after sum up all SKU's quantity
      data.Availability = productAvailableQuantity;
      templateData.quantity = productAvailableQuantity;

      const tModel = new S4STableModel();
      tModel.header = makeHeaders();
      tModel.setPgDefaults();
      tModel.populate(makeRows(collection), { 0: 'sort' });
      templateData.model = tModel;

      this.modalSvc.create({
        component: InfoModalComponent,
        inputs: {
          displayData: {
            header: this.nlsMap['common.LABEL_supplierDetails'],
            headerClass: 'modal-header-class',
            template: this.supplierTpl,
            templateData
          },
          buttonData: {
            callback: () => {
              this.supplierSingleton = 0;
              console.log('supplierSingleton value on close for supplier ', this.supplierSingleton);
            },
            primary: '',
            class: {
              primary: true
            },
            text: this.nlsMap['common.LABEL_ok']
          }
        }
      });
    } catch (err) {
      console.log('Error fetching on Supplier click: ', err);
      this.supplierSingleton = 0;
      console.log('Reset supplierSingleton on Error', this.supplierSingleton);
    }
  }

  /**
   * Called when SKU clicked in supplier modal table
   * @param sku SKU whose location to fetch
   * @param supplier Supplier to fetch location for
   */
  public async onLocation(sku: any, supplier: Supplier) {
    try {
      this.supplierSkuSingleton++;
      console.log('supplierSkuSingleton value on click for SKU ', this.supplierSkuSingleton);
      if (this.supplierSkuSingleton >= 2) {
        return;
      }

      const locData = [];
      const makeHeaders = () => [
        [
          new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.LOCATION') }),
          new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY_NOW') }),
          new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY_LATER') }),
          // new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.HEADER_EARLIEST_AVAILABILITY_DATE') }),
        ]
      ];
      const makeRows = (records) => records
        .map(loc => ([
          { data: loc.shipNodeLocation, id: loc.sku },
          { data: loc.skuOnHandAvailableQuantity },
          { data: loc.skuFutureAvailableQuantity + loc.skuAvailableDate },
          // { data: loc.skuAvailableDate },
        ]));

      const templateData: any = {
        supplier,
        sku,
        locData,
        hideMap: true,
        googleMap: undefined,
        buttonCaption: this.nlsMap['common.LABEL_showMap'],
        mapInitializer: this._mapInitializer.bind(this),
        switch: (self, mapRef) => {
          console.log('google map in switch self mapRef', self, mapRef);
          self.hideMap = !self.hideMap;
          if (!self.hideMap) {
            self.mapInitializer(mapRef, self);
            self.buttonCaption = this.nlsMap['common.LABEL_showTable'];
          } else {
            self.buttonCaption = this.nlsMap['common.LABEL_showMap'];
          }
        },
      };

      const resp = await this.invDistService.getShipNodesForSupplier(supplier.supplier_id).toPromise();

      const shipNodes = getArray(resp);
      shipNodes.forEach(shipNode => {
        const sn: SupplierLocation = {
          shipnode_id: shipNode.shipnode_id,
          _id: shipNode._id,
          shipnode_name: shipNode.shipnode_name,
          latitude: shipNode.latitude,
          longitude: shipNode.longitude,
          supplier_id: shipNode.supplier_id
        };
        this.supplierLocationMap[sn.shipnode_id] = sn;
      });
      console.log('Model - S4S supplierLocationMap ', this.supplierLocationMap);

      // 2. Call IV 'Get Network Availability Product Breakup' for network (supplier) - returns list of all child items
      console.log('Get IV Network Availability at ship node level For selected Child Item', sku.itemId);
      const ivResponse = await this.invAvailService.getInventoryForSkuAtNodes(
        sku.itemId, shipNodes.map(n => n.shipnode_id), 'UNIT', sku.productClass
      ).toPromise();
      console.log('IV response', ivResponse);


      let skuAvailableQuantity = 0;

      const lines = getArray(ivResponse.lines);
      lines.filter(l => l.itemId === sku.itemId).forEach(line => {
        const iv = getArray(line.shipNodeAvailability).filter(l => l.totalAvailableQuantity > 0);
        iv.forEach(nodeIv => {
          const name = this.supplierLocationMap[nodeIv.shipNode] ? this.supplierLocationMap[nodeIv.shipNode].shipnode_name : undefined;
          const shipNodeLocation = name || nodeIv.shipNode;
          skuAvailableQuantity += nodeIv.totalAvailableQuantity;

          let skuAvailableDate = '';
          if (nodeIv.futureAvailableQuantity > 0) {
            skuAvailableDate = new DatePipe('en-US').transform(nodeIv.futureEarliestShipTs, 'MM/dd/yyyy');
            skuAvailableDate = ` (starts on ${skuAvailableDate} )`;
          }

          locData.push({
            shipNodeLocation,
            sku: line.itemId,
            availableQuantity: nodeIv.totalAvailableQuantity,
            latitude: this.supplierLocationMap[nodeIv.shipNode].latitude,
            longitude: this.supplierLocationMap[nodeIv.shipNode].longitude,
            skuOnHandAvailableQuantity: ((nodeIv.onhandAvailableQuantity > 0) ?
              nodeIv.onhandAvailableQuantity : '-'),
            skuFutureAvailableQuantity: ((nodeIv.futureAvailableQuantity > 0) ?
              nodeIv.futureAvailableQuantity : '-'),
            skuAvailableDate
          });
        });
      });

      // product AvailableQuantity after sum up all SKU per location quantity
      sku.availableQuantity = skuAvailableQuantity;

      const tModel = new S4STableModel();
      tModel.header = makeHeaders();
      tModel.setPgDefaults();
      tModel.populate(makeRows(locData));
      templateData.model = tModel;

      this.modalSvc.create({
        component: InfoModalComponent,
        inputs: {
          displayData: {
            header: this.nlsMap['common.LABEL_supplierLocation'],
            headerClass: 'modal-header-class',
            template: this.locationTpl,
            templateData
          },
          buttonData: {
            callback: () => {
              this.supplierSkuSingleton = 0;
              console.log('supplierSkuSingleton value on close for SKU', this.supplierSkuSingleton);
            },
            primary: '',
            class: {
              primary: true
            },
            text: this.nlsMap['common.LABEL_ok']
          }
        }
      });
    } catch (err) {
      console.log('Error fetching on SKU click: ', err);
      this.supplierSkuSingleton = 0;
      console.log('Reset supplierSkuSingleton on Error', this.supplierSkuSingleton);
    }
  }

  private _mapInitializer(ref, caller) {
    const markers = caller.locData.map(location => ({
      position: new google.maps.LatLng(location.latitude, location.longitude),
      title: location.shipNodeLocation + '( ' + location.availableQuantity + ' )'
    }));
    console.log('final map data locMapData', markers);

    // to point the map to a location and centralize
    if (markers.length > 0) {
      const coordinates = markers[0].position;
      const customMapOptions = { center: coordinates, zoom: 4 };
      if (!caller.googleMap) {
        caller.googleMap = new google.maps.Map(ref, customMapOptions);
      }
      this._loadAllMarkers(caller.googleMap, markers);
    }
  }

  private _loadAllMarkers(mapObj: google.maps.Map, markers: any): void {
    markers.forEach(markerInfo => {
      // Creating a new marker object
      const marker = new google.maps.Marker({
        ...markerInfo
      });

      // creating a new info window with markers info
      const infoWindow = new google.maps.InfoWindow({
        content: marker.getTitle()
      });

      // Add click event to open info window on marker
      marker.addListener('click', () => {
        infoWindow.open(marker.getMap(), marker);
      });

      // Adding marker to google map
      marker.setMap(mapObj);
    });
  }


  onChangeSearchByModelNo(event) {
    this.isSearchByModelNo = !this.isSearchByModelNo;
    console.log('isSearchByModelNo -->', this.isSearchByModelNo);

    this._refreshSupplierTableHeader(this.isSearchByModelNo);
    this._refreshSupplierTable([], this.isSearchByModelNo);

    this._clearCarbonCombo(this.products.comboBox);
    this._clearCarbonCombo(this.categories.comboBox);

    this.selectedProd.item_id = undefined;


    this.selectedModelNumbers = [];
    this.lastSearchedModelNumbers = [];
    this._clearCarbonCombo(this.modelnumbers.comboBox);
    // clear multi select
    this.modelNumberListValues.forEach(i => i.selected = false);
    this.modelNumberListValues = this.modelNumberListValues.map(i => i);
    this.selectedSuppliers = [];
    this.lastSelectedSuppliers = [];
    // this._clearCarbonCombo(this.suppliers.comboBox);
    // clear multi select
    this.supplierList.forEach(i => i.selected = false);
    this.supplierList = this.supplierList.map(i => i);

  }
}
