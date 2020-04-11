import { Component, OnInit, ViewChild, TemplateRef, HostBinding, ElementRef  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

import { COMMON } from '@buc/common-components';
import { TableHeaderItem, ModalService } from 'carbon-components-angular';
import { InventoryAvailabilityService } from '../shared/services/inventory-availability.service';
import { InventoryDistributionService } from '../shared/services/inventory-distribution.service';
import { getArray } from '../shared/common/functions';

import { InfoModalComponent } from '../shared/components/info-modal/info-modal.component';
import { Supplier } from '../shared/common/supplier';
import { SupplierLocation } from '../shared/common/supplierLocation';
import { Product } from '../shared/common/product';
import { SKU } from '../shared/common/sku';
import { S4STableModel } from '../shared/common/table-model';
import { Constants } from '../shared/common/constants';



// PENDING - 1 - Need additonal logic to see the logged in users timezone
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
    'common.LABEL_ok': '',
    'common.LABEL_noContact': '',
    'common.LABEL_noPhone': '',
    'common.LABEL_none': '',
    'common.LABEL_new': '',
    'common.LABEL_used': '',
    'common.LABEL_showMap': '',
    'common.LABEL_showTable': ''
  };

  private supplierMap: { [ key: string ]: Supplier } = {};
  private skuMap: { [ key: string ]: SKU } = {};
  private supplierLocationMap: { [ key: string ]: SupplierLocation } = {};
  private cat2ProdMap: { [ key: string ]: any } = {};

  private selectedCat: string;
  private selectedProd: Product = { item_id: undefined, description: undefined };
  private selectedPc: string = 'NEW';
  private supplierSingleton: number = 0;
  private supplierSkuSingleton: number = 0;

  @HostBinding('class') page = 'page-component';
  isScreenInitialized = false;
  model = new S4STableModel();
  categoryListValues = [];
  productListValues = [];
  pcRadios = [];

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

  private async _init() {
    await this._initTranslations();
    this._initializePage();
  }

  private async _initTranslations() {
    const keys = Object.keys(this.nlsMap);
    const json = await this.translateSvc.get(keys).toPromise();
    keys.forEach(k => this.nlsMap[k] = json[k]);
  }

  private _initializePage() {
    this.model.setPgDefaults();
    this._initPcTypes();
    this._initCategories();
    this._fetchAllSuppliers();
    this._refreshSupplierTableHeader();
  }

  private _initPcTypes() {
    const list = [
      { value: Constants.PC_NEW, content: this.nlsMap['common.LABEL_new'], checked: true},
      { value: Constants.PC_USED, content: this.nlsMap['common.LABEL_used']},
      { value: Constants.PC_NONE, content: this.nlsMap['common.LABEL_none']},
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
      const attrMap: { [ key: string ]: { value: string } } = COMMON.toMap(supplier.address_attributes, 'name');
      const s: Supplier = {
        _id: supplier._id,
        supplier_id: supplier.supplier_id,
        description: supplier.description,
        descAndNode: '',
        supplier_type: supplier.supplier_type,
        url: supplier.supplier_url || '',
        contactPerson: supplier.contact_person || this.nlsMap['common.LABEL_noContact'],
        address_line_1: getValue(attrMap.address_line_1),
        city: getValue(attrMap.city),
        state: getValue(attrMap.state),
        zipcode: getValue(attrMap.zipcode),
        country: getValue(attrMap.country),
        phoneNumber: getValue(attrMap.phone_number, this.nlsMap['common.LABEL_noPhone'])
      };

      this.supplierMap[s.supplier_id] = s;
    });

    console.log('Model - S4S allSuppliers List ' , this.supplierMap);
  }

  private async _fetchProductsById(childItems: string[]) {
    const responses4s = await this.invDistService.fetchProductList( childItems ).toPromise();
    console.log('S4S response -  fetchAllProducts',  responses4s);
    const products = getArray(responses4s);
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
    if (cat && cat !== this.selectedCat) {
      this.selectedCat = cat;
      this.selectedProd.item_id = undefined;
      this.productListValues = [];

      try {
        this.model.isLoading = true;

        // reset table
        this._refreshSupplierTable([]);

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

        this.model.isLoading = false;
        console.log('Model - Product List ' , this.productListValues);
      } catch (err) {
        console.log('Error fetching availability: ', err);
      }
    }
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
    if (id && id !== this.selectedProd.item_id) {
      this.selectedProd.item_id = id;
      this.selectedProd.description = event.item.content ;
      this._fetchSuppliersForProductAndClass();
    }
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
          product: this.selectedProd,
          productClass: this.selectedPc,
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

    const records = data.map((record, i) => [
      {
        data: { name: record.supplier.description, descriptor: record },
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

    this.model.setPgDefaults();
    this.model.populate(records, { 0: 'name' });

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
          new TableHeaderItem({ data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY') }),
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
          { data: sku.availableQuantity }
        ]));

      const templateData: any = {
        supplier: data.supplier,
        product: data.product,
        quantity: data.Availability,
        date: data.Date
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

      lines.forEach(line => {
        const sku = this.skuMap[line.itemId];
        console.log('S4S response Child Item ', sku);
        if (sku && sku.unit_of_measure !== undefined) {
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
              itemAvailableDate: line
            }
          );
        }
      });

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
      const locData = [];
      this.supplierSkuSingleton++;
      console.log('supplierSkuSingleton value on click for SKU ', this.supplierSkuSingleton);
      if (this.supplierSkuSingleton >= 2) {
        return;
      }
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

     
      const lines = getArray(ivResponse.lines);
      lines.filter(l => l.itemId === sku.itemId).forEach(line => {
        const iv = getArray(line.shipNodeAvailability).filter(l => l.totalAvailableQuantity > 0);
        iv.forEach(nodeIv => {
          const name = this.supplierLocationMap[nodeIv.shipNode] ? this.supplierLocationMap[nodeIv.shipNode].shipnode_name : undefined;
          const shipNodeLocation = name || nodeIv.shipNode;
          locData.push({ shipNodeLocation, sku: line.itemId, availableQuantity: nodeIv.totalAvailableQuantity, 
            latitude: this.supplierLocationMap[nodeIv.shipNode].latitude, longitude: this.supplierLocationMap[nodeIv.shipNode].longitude });
        });
      });


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
    const markers = [];
    const datas = getArray(caller);
    console.log('google map  _mapInitializer datas', datas);

    let first = true;
    datas.forEach(data => {
      console.log('google map  data.locData', data.locData);
      data.locData.map((location) => (
        markers.push({
          position: new google.maps.LatLng(location.latitude, location.longitude),
          map: caller.googleMap, title: location.shipNodeLocation + '( ' + location.availableQuantity + ' )'
        })
      ));
    });

    //to point the map to a location and centralize
    if (first && markers.length > 0) {
      first = false;
      const coordinates = markers[0].position;
      const customMapOptions = { center: coordinates, zoom: 4 };
      if (!caller.googleMap) {
        caller.googleMap = new google.maps.Map(ref, customMapOptions);
      }
    }
    console.log('final map data locMapData', markers)

    this._loadAllMarkers(caller.googleMap, markers);
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
}
