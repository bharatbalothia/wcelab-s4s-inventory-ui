import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

import { BucTableModel } from '@buc/common-components';
import { TableHeaderItem, ModalService } from 'carbon-components-angular';
import { InventoryAvailabilityService } from '../shared/services/inventory-availability.service';
import { InventoryDistributionService } from '../shared/services/inventory-distribution.service';
import { getArray, getString } from '../shared/common/functions';

import { InfoModalComponent } from '../shared/components/info-modal/info-modal.component';
import { Supplier } from '../shared/common/supplier';
import { Product } from '../shared/common/product';
import { SKU } from '../shared/common/sku';

// PENDING - 1 - Need additonal logic to see the logged in users timezone
// TODO -2  : Code Change to make on IV call to pass array of Supplier, instead of multiple IV calls.
@Component({
  selector: 'app-homepage1',
  templateUrl: './homepage1.component.html',
  styleUrls: ['./homepage1.component.scss'],
})
export class Homepage1Component implements OnInit {
  @ViewChild('supplierLink', { static: true }) private supplierLink: TemplateRef<any>;
  @ViewChild('supplierTpl', { static: true }) private supplierTpl: TemplateRef<any>;
  @ViewChild('supplierLocationLink', { static: true }) private supplierLocationLink: TemplateRef<any>;
  @ViewChild('locationTpl', { static: true }) private locationTpl: TemplateRef<any>;

  private nlsMap: any = {
    'common.LABEL_supplierDetails': '',
    'common.LABEL_supplierLocation': '',
    'common.LABEL_ok': ''
  };
  private supplierMap: { [ key: string ]: Supplier } = {};
  private skuMap: { [ key: string ]: SKU } = {};
  private selectedCat: string;
  private selectedProd: string;

  public isScreenInitialized = false;
  public toolBarAction;
  public toolBarContent;
  model = new BucTableModel();

  // Page settings start
  private pageSize;
  private pageNumber;
  public searchValue = '';
  public categoryListValues = [];
  public productListValues = [];
  public allSuppliersSearchByProductId = [];

  public dgNodes = [];
  public errorMessage = '';

  public nodeAvailability: any;

  // added
  public selectedSupplierId ;
  public userSelectedChildItemId;
  // for AOT compiler -- template should probably remove mention of this double-binding (unused)
  private records: string[] = [];
  set selected(records) { this.records = records; }
  get selected() { return this.records; }

  constructor(
    private translateService: TranslateService,
    private invAvailService: InventoryAvailabilityService,
    private invDistService: InventoryDistributionService,
    private modalSvc: ModalService,
    private translateSvc: TranslateService
  ) { }

  ngOnInit() {
    this._init();
  }


  onSelectPage(e) { this._selectPage(e, this.model); }
  onSort(e) { this._sort(e, this.model); }

  private async _init() {
    await this._initTranslations();
    this._initializePage();
  }

  private async _initTranslations() {
    const keys = Object.keys(this.nlsMap).filter(k => k !== 'safetyStock.LABEL_nNodes');
    const json = await this.translateSvc.get(keys).toPromise();
    keys.forEach(k => this.nlsMap[k] = json[k]);
  }

  private _initializePage() {
    this.model = new BucTableModel();
    this.model.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
    this.model.currentPage = 1;
    this.pageSize = this.model.pageLength;
    this.pageNumber = this.model.currentPage;

    if (!this.isScreenInitialized) {
      this._initCategories();
      this._fetchAllSuppliers();
      this._refreshSupplierTableHeader();
    }
  }

  private async _fetchAllSuppliers() {
    const getAttrValue = (raw: any[], name) => {
      const attrs = getArray(raw);
      const names = attrs.filter(a => a.name === name);
      return names.length > 0 ? names[0].value : '-';
    };
    const responses4s = await this.invDistService.fetchAllSuppliers().toPromise();
    console.log('S4S response -  fetchAllSuppliers',  responses4s);
    getArray(responses4s).forEach((supplier) => {
      const s: Supplier = {
        _id: supplier._id,
        supplier_id: supplier.supplier_id,
        description: supplier.description,
        descAndNode: '',
        supplier_type: supplier.supplier_type,
        address_line_1: getAttrValue(supplier.address_attributes, 'address_line_1'),
        city: getAttrValue(supplier.address_attributes, 'city'),
        state: getAttrValue(supplier.address_attributes, 'state'),
        zipcode: getAttrValue(supplier.address_attributes, 'zipcode'),
        country: getAttrValue(supplier.address_attributes, 'country'),
        contactPerson: getAttrValue(supplier.address_attributes, 'contactPerson'),
        phoneNumber: getAttrValue(supplier.address_attributes, 'phoneNumber')
      };

      this.supplierMap[s.supplier_id] = s;
    });

    console.log('Model - S4S allSuppliers List ' , this.supplierMap);
  }

  private async _fetchProductLists(childItems: string[]) {
    const responses4s = await this.invDistService.fetchProductList( childItems ).toPromise();
    console.log('S4S response -  fetchAllProducts',  responses4s);
    const products = getArray(responses4s);
    products.forEach(product => {
      const s: SKU = {
        unit_of_measure: product.unit_of_measure,
        _id: product._id,
        item_id: product.item_id,
        description: product.description,
        category: product.category
      };
      this.skuMap[s.item_id] = s;
    });
    console.log('Model - S4S allProducts List ', this.skuMap);
  }

  private async _initCategories() {
    const responses4s = await this.invDistService.getAllCategories().toPromise();
    console.log('S4S response - getAllCategories '  , responses4s);
    this.categoryListValues = getArray(responses4s).map((c) => ({
      content: c.category_description,
      id: c.category_id,
      selected: false
    }));
    console.log('Model - category List ' , this.categoryListValues);
    this.isScreenInitialized = true;
  }

  /**
   * Padman: Fetch All Products By Category
   * @param event category-id container
   */
  public async onCategory(event) {
    const cat = event.item.id;
    console.log('User selected Category ', cat);
    if (cat && cat !== this.selectedCat) {
      this.selectedCat = cat;
      try {
        this.model.isLoading = true;

        // reset table
        this._refreshSupplierTable([]);

        const responses4s = await this.invDistService.getAllProductsByCategoryId(cat).toPromise();
        console.log('S4S response of all products with in selected category id ', cat, responses4s);
        this.productListValues = getArray(responses4s).map((product) => ({
          content: `${product.description} (${product.item_id})`,
          id: product.item_id,
          selected: false
        }));
        this.model.isLoading = false;
        console.log('Model - Product List ' , this.productListValues);
      } catch (err) {
        console.log('Error fetching availability: ', err);
      }
    }
  }

  /**
   * Fetch Supplier for searched product id starts
   * Padman: Get Availability & Date Group by Supplier For user selected ProductId
   * @param event product-id container
   */
  public async onProduct(event) {
    const id = event.item.id;
    const product: Product = { item_id: id, description: event.item.content };
    console.log('User selected Product ', id);
    if (id && id !== this.selectedProd) {
      this.selectedProd = id;
      try {
        this.model.isLoading = true;

        const allSuppliersHavingSelectedProduct = [];
        const suppliers = Object.keys(this.supplierMap);

        const resp = await this.invAvailService.getConslidatedInventoryForDG( [ id ], suppliers, ['UNIT'], [ 'GOOD' ]).toPromise();
        console.log('IV response ',  resp);

        const lines = getArray(resp.lines)
        .filter(l => l.networkAvailabilities.length > 0 && l.networkAvailabilities[0].totalAvailableQuantity > 0);

        for (const line of lines) {
          console.log('line', line, line.networkAvailabilities[0].distributionGroupId );
          const supplier = this.supplierMap[line.networkAvailabilities[0].distributionGroupId];
          supplier.descAndNode = `${supplier.description} (${line.networkAvailabilities[0].distributionGroupId})`;

          let availableDate = 'Now';
          if (line.networkAvailabilities[0].thresholdType === 'ONHAND') {
            availableDate = 'Now';
          } else {
            availableDate = new DatePipe('en-US').transform(line.networkAvailabilities[0].earliestShipTs, 'MM/dd/yyyy');
          }

          allSuppliersHavingSelectedProduct.push({
            supplier,
            product,
            Availability: line.networkAvailabilities[0].totalAvailableQuantity,
            Date: availableDate
            // TODO PENDING - 1
          });
        }

        this.model.isLoading = false;

        console.log('Model - allSuppliersHavingSelectedProduct' , allSuppliersHavingSelectedProduct);
        this._refreshSupplierTable(allSuppliersHavingSelectedProduct);
      } catch (err) {
        console.log('Error fetching availability: ', err);
      }
    }
  }

  private _refreshSupplierTableHeader() {
    this.model.header = [
      [
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_SUPPLIER'),
          sortable: true
        }),
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY'),
          sortable: true
        }),
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_DATE'),
          sortable: true
        }),
      ]
    ];
  }

  private _refreshSupplierTable(data) {
    this.model.isLoading = true;
    this.model.pageLength = this.pageSize;
    this.model.currentPage = this.pageNumber;
    this.model.data = data.map((record, i) => [
      {
        data: { name: record.supplier.supplier_id, descriptor: record },
        template: this.supplierLink,
        id: i
      },
      {
        data: record.Availability,
      },
      {
        data: record.Date
      }
    ]);
    this.model.totalDataLength = data.length;
    this.model.isLoading = false;
  }

  async onSupplier(data) {
    const makeHeaders = () => [
      [
        new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.PRODUCT_MODEL_NUMBER') }),
        new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.UOM') }),
        new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY') }),
      ]
    ];
    const makeRows = (records) => records
    .map(sku => ([
      { data: { sku, supplier: data.supplier }, template: this.supplierLocationLink, id: sku.itemId },
      { data: sku.unitOfMeasure, },
      { data: sku.availableQuantity }
    ]));

    const templateData: any = {
      description: data.supplier.description,
      name: data.supplier.contactPerson,
      contactNumber: data.supplier.phoneNumber,
      product: data.product,
      quantity: data.Availability,
      date: data.Date
    };

    templateData.model = new BucTableModel();
    templateData.model.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
    templateData.model.currentPage = 1;
    templateData.onSelectPage = (e) => { this._selectPage(e, templateData.model); };
    templateData.onSort = (e) => { this._sort(e, templateData.model); };

    const resp = await this.invAvailService.getInventoryForNetwork(
      [ data.product.item_id ],
      [ data.supplier.supplier_id ],
      ['UNIT'],
      []
    ).toPromise();

    const children = [];
    const collection = [];
    const lines = getArray(resp.lines);
    lines.forEach(line => {
      if (line.networkAvailabilities.length > 0 &&
          line.networkAvailabilities[0].totalAvailableQuantity > 0 &&
          (lines.length < 2 || line.itemId !== data.product.item_id) &&
          !this.skuMap[line.itemId]) {
        children.push(line.itemId);
      }
    });

    if (children.length > 0) {
      await this._fetchProductLists(children);
    }

    lines.forEach(line => {
      if (line.networkAvailabilities.length > 0 &&
          line.networkAvailabilities[0].totalAvailableQuantity > 0 &&
          (lines.length < 2 || line.itemId !== data.product.item_id)) {
        const sku = this.skuMap[line.itemId];
        console.log('S4S response Child Item ', sku);
        if (sku && sku.unit_of_measure !== undefined) {
          collection.push(
            {
              itemId : sku.item_id,
              parentData: { product: data.product, quantity: data.Availability, date: data.Date },
              itemDescription : sku.description,
              unitOfMeasure: sku.unit_of_measure,
              shipNodes : line.networkAvailabilities[0].distributionGroupId ,
              availableQuantity : line.networkAvailabilities[0].totalAvailableQuantity ,
              itemAvailableDate : line
            }
          );
        }
      }
    });

    templateData.model.header = makeHeaders();
    templateData.model.data = makeRows(collection);
    templateData.model.totalDataLength = data.length;

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
          primary: '',
          class: {
            primary: true
          },
          text: this.nlsMap['common.LABEL_ok']
        }
      }
    });
  }

  public async onLocation(sku, supplier) {
    const makeHeaders = () => [
      [
        new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.LOCATION') }),
        new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY') })
      ]
    ];
    const makeRows = (records) => records
    .map(loc => ([
      { data: loc.shipNodeLocation, id: loc.sku },
      { data: loc.availableQuantity }
    ]));

    const templateData: any = {
      supplier,
      sku
    };

    templateData.model = new BucTableModel();
    templateData.model.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
    templateData.model.currentPage = 1;
    templateData.onSelectPage = (e) => { this._selectPage(e, templateData.model); };
    templateData.onSort = (e) => { this._sort(e, templateData.model); };

    const resp = await this.invDistService.getByTenantIdV1ConfigurationShipNodes().toPromise();
    const shipNodeList = resp.map(n => n.shipNode);
    const locData = [];
    console.log('Model - shipNodes List ' , shipNodeList);

     // 2. Call IV 'Get Network Availability Product Breakup' for network (supplier) - returns list of all child items
    console.log('Get IV Network Availability at ship node level For selected Child Item', sku.itemId );
    const ivResponse = await this.invAvailService.getInventoryForNodes(
      [ sku.itemId ], shipNodeList , ['UNIT'], []
    ).toPromise();

    console.log('IV response', ivResponse);
    const lines = getArray(ivResponse.lines);
    lines.filter(l => l.itemId === sku.itemId).forEach(line => {
      const iv = getArray(line.shipNodeAvailability);
      iv.forEach(nodeIv =>
        locData.push({ shipNodeLocation: nodeIv.shipNode, sku: line.itemId, availableQuantity: nodeIv.totalAvailableQuantity })
      );
    });
    templateData.model.header = makeHeaders();
    templateData.model.data = makeRows(locData);
    templateData.model.totalDataLength = locData.length;


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
          primary: '',
          class: {
            primary: true
          },
          text: this.nlsMap['common.LABEL_ok']
        }
      }
    });
  }

  private _selectPage(pg, model) {
  }

  private _sort(e, model) {
  }
}
