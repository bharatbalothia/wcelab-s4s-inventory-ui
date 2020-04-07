import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import {
  BucTableToolbarModel,
  BucTableHeaderModel,
  BucTableModel,
  BucTableFilterModel
} from '@buc/common-components';
import { TableHeaderItem } from 'carbon-components-angular';
import { InventoryAvailabilityService } from '../shared/services/inventory-availability.service';
import { InventoryDistributionService } from '../shared/services/inventory-distribution.service';
import { InventoryDemandService } from '../shared/services/inventory-demand.service';

import  *  as   GetSuppliersByProductIdJSON from './GetSuppliersByProductId.json';
import  *  as   GetSuppliersByProductIdGroupByItemJSON from './GetSuppliersByProductIdGroupByItem.json';
import  *  as   GetLocationAndAvailabilityByItem from './GetLocationAndAvailabilityByItem.json';
import { AvailabilityService } from '../shared/rest-services/Availability.service';

//PENDING - 1 - Need additonal logic to see the logged in users timezone
//TODO -2  : Code Change to make on IV call to pass array of Supplier, instead of multiple IV calls.
@Component({
  selector: 'app-homepage1',
  templateUrl: './homepage1.component.html',
  styleUrls: ['./homepage1.component.scss'],
})
export class Homepage1Component implements OnInit {
  public isScreenInitialized = false;
  public toolBarAction;
  public toolBarContent;
  model = new BucTableModel();
  modelFirstOverylay = new BucTableModel();
  modelSecondOverylay = new BucTableModel();
 

  
  // Page settings start
  private pageSize;
  private pageNumber;
  public searchValue = '';
  private countyPrefix = 'CT_';
  private regionPrefix = 'REG_';
  public dgListValues = [];
  public categoryListValues = [];
  public productListValues = [];
  public allSuppliers = [];
  public allSuppliersSearchByProductId = [];
  public selectedSupplier;
  public availabilityByProductBreakUp = [];
  public locationAvailabilityByProductBreakUp = [];
  
  public supplier ;
  public dgNodes = [];
  public errorMessage = '';
  public isDGSelected = false;
  public selectedDG;
  public selectedCategory;
  public selectedProductId;

  public ProductBreakupBySupplier = [];

  public nodeAvailability: any;
  public displayFirstOverlay = false ;
  public displaySecondOverlay = false;
  private topItemIds = ['012', '013', '014', '015', '018'];
  private uoms = ['EACH', 'EACH', 'EACH', 'EACH', 'EACH'];

  //added
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
    private invDemandService: InventoryDemandService 

  ) { }

  ngOnInit() {
    this.initializePage();

  }

  initializePage() {
    this.isDGSelected = false;
    this.model = new BucTableModel();
    this.model.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
    this.model.currentPage = 1;
    this.pageSize = this.model.pageLength;
    this.pageNumber = this.model.currentPage;

    this.modelFirstOverylay = new BucTableModel();
    this.modelFirstOverylay.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
    this.modelFirstOverylay.currentPage = 1;

    this.modelSecondOverylay = new BucTableModel();
    this.modelSecondOverylay.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
    this.modelSecondOverylay.currentPage = 1;

 

    if (!this.isScreenInitialized) {
      
      
      this.initializeCategoriesListDropDown();
       this.fetchAllSuppliers();
       this.refreshSupplierTableHeader();
       this.refreshSupplierLocationAvailDetailsTableHeader();
    }

  }
 

  async initializeCategoriesListDropDown() {   
    const responses4s = await this.invDistService.getAllCategories( ).toPromise();
    console.log('S4S response - getAllCategories '  , responses4s);
    const allCategories = [];

    if (responses4s.length > 0) {
      for (const category of responses4s) {
        allCategories.push(category); 
      }
    }
     
    this.categoryListValues = allCategories.map((category) => {
      return {
        content: category.category_id,
        id: category._id,
        selected: false
      };
    });
    console.log('Model - Cateogry List ' ,this.categoryListValues);
    this.isScreenInitialized = true;
  }
  
  //Padman: Fetch All Products By Category
  public fetchAllProductsByCategoryId(event) {
    this.selectedCategory = event.item.content;
    console.log('User selected Category ', this.selectedCategory);
    if (this.selectedCategory !== '') {
      this._getAllProductsByCategoryId(this.selectedCategory);
    }
  }

  private async _getAllProductsByCategoryId(selectedCategory) {
    try {
      const responses4s = await this.invDistService.getAllProductsByCategoryId( selectedCategory ).toPromise();
      console.log('S4S response of all products with in selected category id ',  selectedCategory , responses4s);
      const allProducts = [];
      if (responses4s.length > 0) {
        for (const product of responses4s) {
          allProducts.push(product); 
        }
      }
      
      this.productListValues = allProducts.map((product) => {
        return {
          content: product.description, 
          id: product.item_id,
          selected: false
        };
      });
      console.log('Model - Product List ' ,this.productListValues);
    } catch (err) {
      console.log('Error fetching availability: ', err);
    }
  }

  // Fetch Supplier for searched product id starts
  //Padman: Get Availability & Date Group by Supplier For user selected ProductId 
  public fetchAllSuppliersByProductId(event) {
    this.selectedProductId = event.item.id;
    console.log('User selected Product ', this.selectedProductId); 
    if (this.selectedProductId !== '') {
     this._getAllSuppliersByProductId(this.selectedProductId);
    }
  }

  private async _getAllSuppliersByProductId(selectedProductId) {
    try {
      const allSuppliersHavingSelectedProduct = [] ;
	  //TODO -2  : Code Change to make on IV call to pass array of Supplier, instead of multiple IV calls.
      for (const supplier of this.allSuppliers) {
        const supplierName = supplier.supplier_id;
        console.log('Making IV call with all Available Supplier Name',  supplierName , 'And selected Product Id ' , selectedProductId); 
        const ivResponse = await this.invAvailService.getInventoryForDG( [selectedProductId], supplierName , ['UNIT'],['GOOD'] ).toPromise();
        console.log('IV response ',  ivResponse);
        if ( ivResponse.lines.length > 0) {
          const availabilityGroupBySupplier = ivResponse.lines[0];
          for (const line of ivResponse.lines){
            if(line.itemId == selectedProductId){
              
              if( availabilityGroupBySupplier.networkAvailabilities.length > 0 &&
                ( availabilityGroupBySupplier.networkAvailabilities[0].totalAvailableQuantity >0 ) ){
                const now = Date.now();
                var availableDate = 'Now';
                
                if(availabilityGroupBySupplier.networkAvailabilities[0].thresholdType =='ONHAND'){
                  availableDate = 'Now';
                }else{
                  availableDate = new DatePipe('en-US').transform(availabilityGroupBySupplier.networkAvailabilities[0].earliestShipTs, 'MM/dd/yyyy');
                } 
                allSuppliersHavingSelectedProduct.push({
                  Supplier: supplier.description +' ('+supplier.supplier_id + ')',
                  Availability: availabilityGroupBySupplier.networkAvailabilities[0].totalAvailableQuantity,
                  Date: availableDate
                  //TODO PENDING - 1
                }); 
              }
            }
          }
        }
      }
      
      console.log('Model - allSuppliersHavingSelectedProduct' , allSuppliersHavingSelectedProduct);
      this.ProductBreakupBySupplier = allSuppliersHavingSelectedProduct;
      this.prepareSupplierTable(allSuppliersHavingSelectedProduct);
    } catch (err) {
      console.log('Error fetching availability: ', err);
    }
  }

  prepareSupplierTable(response) {
    this.refreshSupplierTableHeader();
    this.refreshSupplierTable(response);
  }

  refreshSupplierTableHeader(){
    this.model.header = [
      [
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_SUPPLIER'),
          sortable: false, style: {}
        }),
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY'),
          sortable: true, style: {}
        }),
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_DATE'),
          sortable: true, style: {}
        }),
      ]
    ];
  }

  refreshSupplierTable(data) {
    this.isScreenInitialized = false;
    this.model.pageLength = this.pageSize;
    this.model.currentPage = this.pageNumber;
    this.model.data = data.map(supplier => this.createSupplierTableRow(supplier));
    this.model.totalDataLength = data.length;
    this.isScreenInitialized = true;
  }

  createSupplierTableRow(supplier) {
 
    const tableRow = [
      {
        data: supplier.Supplier
      },
      {
        data: supplier.Availability,
      },
      {
        data: supplier.Date
      }
    ];
    return tableRow;
  }
  // Fetch Supplier for searched product id ends

  async fetchAllSuppliers() {
    const responses4s = await this.invDistService.fetchAllSuppliers( ).toPromise();
    console.log('S4S response -  fetchAllSuppliers',  responses4s);

    const suppliers = [];
    if (responses4s.length > 0) {
      for (const supplier of responses4s) {
        suppliers.push(supplier); 
      }
    }

    this.allSuppliers = suppliers.map((supplier) => {
      return {
        _id: supplier._id,
        supplier_id: supplier.supplier_id,
        description: supplier.description,
        supplier_type: supplier.supplier_type, 
        address_line_1 : this.getValueByName(supplier.address_attributes,'address_line_1'),
        city : this.getValueByName(supplier.address_attributes,'city'),
        state : this.getValueByName(supplier.address_attributes,'state'),
        zipcode : this.getValueByName(supplier.address_attributes,'zipcode'),
        country : this.getValueByName(supplier.address_attributes,'country'),
        contactPerson : this.getValueByName(supplier.address_attributes,'contactPerson'),
        phoneNumber : this.getValueByName(supplier.address_attributes,'phoneNumber'),
      };
    });

    console.log('Model - S4S allSuppliers List ' ,this.allSuppliers);   
  }

  private getValueByName(address_attributes,name){
    if(address_attributes.length > 0 ){  
      for(var i = 0 ; i < address_attributes.length; i++){
        if(name === address_attributes[i].name){
          return address_attributes[i].value
        }
      }
    }
    return "";
  }
  //Fetch Supplier Detail Record starts ------------------
  public fetchSupplierDetails(){
    this._fetchSupplierDetails();
  }
  //1. Call S4s GET/supplier/:id - on select of row
  //2. Call IV 'Get Network Availability Product Breakup' for network (supplier) - returns list of all child items
  //3. Call S4S /product/:id get product details of all child items
  private async _fetchSupplierDetails(){
   //TODO reuse with  cache  object instead of making this call. Make the call if there is a cache miss.
    //1. Call S4s GET/supplier/:id - on select of row
    console.log('User selected Supplier is', this.selectedSupplierId);
    
    let isSupplierFound = false;
    let responses4s;
    this.allSuppliers.forEach(eachSupplier => {
      if (eachSupplier.supplier_id === this.selectedSupplierId) {
        responses4s = eachSupplier;
        isSupplierFound = true;
        console.log('S4S response of the supplier from Cache'  , responses4s);
      }
    }); 
    if(!isSupplierFound){
      responses4s = await this.invDistService.getContactDetailsOfSelectedSupplier(this.selectedSupplierId).toPromise();
      console.log('S4S response of the supplier '  , responses4s);
    }
    

    let supplierContactNumber= (responses4s.phoneNumber !== '' ) ? responses4s.phoneNumber :'Phone number not provided';
    let supplierName =(responses4s.contactPerson !== '') ? responses4s.contactPerson :'Point of contact not provided';
    
    if(responses4s.address_attributes !== undefined){
      for (const address of responses4s.address_attributes) {
        if(address.name === 'name' && address.value !== ''){
          supplierName = address.value;
        }
        if(address.name === 'phoneNumber' && address.value !== ''){
          supplierContactNumber = address.value;
        }
      }
    }

    var productTotalAvailableQuantity;
    var productTotalAvailableDate;
    this.ProductBreakupBySupplier.map((supplier) => {
      productTotalAvailableDate = supplier.Date;
      productTotalAvailableQuantity = supplier.Availability;
      }
    );

    let selectedProductIdModelNumber = this.selectedProductId;      
    this.productListValues.map((product) => {
      if(this.selectedProductId === product.id){
        selectedProductIdModelNumber =  product.content +' (' +this.selectedProductId +') ';
      }
    });
    this.selectedSupplier =   {
      _id: responses4s._id,
      supplier_id: responses4s.supplier_id,
      description: responses4s.description,
      supplier_type: responses4s.supplier_type,
      supplierName:  supplierName,
      supplierContactNumber : supplierContactNumber,
      selectedProductId : this.selectedProductId,
      selectedProductIdModelNumber : selectedProductIdModelNumber, 
      productTotalAvailableQuantity : productTotalAvailableQuantity,
      productTotalAvailableDate : productTotalAvailableDate
    };
    console.log('Model - selectedSupplier ' , this.selectedSupplier);

    //2. Call IV 'Get Network Availability Product Breakup' for network (supplier) - returns list of all child items
    console.log('IV Network Availability Product Breakup for Selected Supplier ', this.selectedSupplierId , '& selected Product ' , this.selectedProductId);
    const ivResponse = await this.invAvailService.getInventoryForNetwork( [this.selectedProductId], [this.selectedSupplierId] , ['UNIT'], [] ).toPromise();
    console.log('IV response ',  ivResponse);
    this.availabilityByProductBreakUp = []; 

    for (const networkAvailability of ivResponse.lines){
      if(networkAvailability.networkAvailabilities.length>0){
           if(ivResponse.lines.length>=2 && networkAvailability.itemId ===this.selectedProductId ){
             continue;
           }
        
        console.log('S4S Child Item ', networkAvailability.itemId); 
        const responsesChildItem4s = await this.invDistService.getChildItemDetails(networkAvailability.itemId).toPromise();
        console.log('S4S response Child Item '  , responsesChildItem4s);
        var unitOfMeasure ;
        if(responsesChildItem4s.unit_of_measure !== undefined ){
          unitOfMeasure = responsesChildItem4s.unit_of_measure ;
          this.availabilityByProductBreakUp.push(
            {
              "itemId" : networkAvailability.itemId,
              "itemDescription" : responsesChildItem4s.description,
              "unitOfMeasure" : unitOfMeasure,
              "shipNodes" : networkAvailability.networkAvailabilities[0].distributionGroupId ,
              "availableQuantity" : networkAvailability.networkAvailabilities[0].totalAvailableQuantity ,
              "itemAvailableDate" : productTotalAvailableDate
            }
          );
        }
      }
    }
    console.log('Model - availabilityByProductBreakUp ' ,this.availabilityByProductBreakUp);
    this.displayFirstOverlay=true;
    this.prepareSupplierDetailsTable(this.availabilityByProductBreakUp); 
  }

   prepareSupplierDetailsTable(response) {
    this.refreshSupplierDetailsTableHeader();
    this.refreshSupplierDetailsTable(response); 
  }

  refreshSupplierDetailsTableHeader(){
    this.modelFirstOverylay.header = [
      [
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.PRODUCT_MODEL_NUMBER'),
          sortable: false, style: {}
        }),
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.UOM'),
          sortable: true, style: {}
        }),
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY'),
          sortable: true, style: {}
        }),
      ]
    ];
  }
  refreshSupplierDetailsTable(data) {
    this.isScreenInitialized = false;
    this.modelFirstOverylay.pageLength = this.pageSize;
    this.modelFirstOverylay.currentPage = this.pageNumber;
    this.modelFirstOverylay.data = data.map(supplier => this.createSupplierDetailsTableRow(supplier));
    this.modelFirstOverylay.totalDataLength = data.length;
    this.isScreenInitialized = true;
  }

  createSupplierDetailsTableRow(supplier) {
    const tableRow = [
      {
        data: supplier.itemDescription +' ('+supplier.itemId +')'
      },
      {
        data: supplier.unitOfMeasure,
      },
      {
        data: supplier.availableQuantity
      }
    ];
    return tableRow;
  }
  // Populate Supplier Details ends

  //Populate Supplier Location starts ------------------
  fetchSupplierLocationRecord(){
    this._fetchSupplierLocationRecord();
  }

  private async _fetchSupplierLocationRecord(){
     
    
    //Fetch all DGs
    console.log('Get all Available ShipNode IV call');
    const shipNodes = await this.invDistService.getByTenantIdV1ConfigurationShipNodes().toPromise(); 
    console.log('IV call response ',  shipNodes);
    let shipNodeList = [];
    shipNodes.map((shipNode) => {
      shipNodeList.push(shipNode.shipNode);
    });
    console.log('Model - shipNodes List ' ,shipNodeList);
   
     //2. Call IV 'Get Network Availability Product Breakup' for network (supplier) - returns list of all child items
    console.log('Get IV Network Availability at ship node level For selected Child Item', this.userSelectedChildItemId);
    const ivResponse = await this.invAvailService.getInventoryForNodes( [this.userSelectedChildItemId], shipNodeList , ['UNIT'], [] ).toPromise();
    console.log('IV  response ',  ivResponse);
    this.locationAvailabilityByProductBreakUp = []; 
    for(const line of ivResponse.lines){
      if(line.itemId == this.userSelectedChildItemId){
        if(line.shipNodeAvailability.length > 0 ){  
          for(var i = 0 ; i < line.shipNodeAvailability.length; i++){
            this.locationAvailabilityByProductBreakUp.push(
              {
                "shipNodeLocation" : line.shipNodeAvailability[i].shipNode, 
                "productId" : line.itemId,
                "availableQuantity" : line.shipNodeAvailability[i].totalAvailableQuantity 
              }
            );
          }
        }
      }
    }


    this.availabilityByProductBreakUp.map((itemAvailability) => {
      console.log('itemAvailability.itemId' , itemAvailability.itemId ,this.selectedProductId );
        if(itemAvailability.itemId === this.userSelectedChildItemId){
          this.selectedSupplier.selectedItemId = itemAvailability.itemId;
          this.selectedSupplier.itemUOM = itemAvailability.unitOfMeasure;
          this.selectedSupplier.itemTotalAvailableQuantity = itemAvailability.availableQuantity;
          this.selectedSupplier.itemAvailableDate = itemAvailability.itemAvailableDate;
        }
      }
    );

    console.log('Model - locationAvailabilityByProductBreakUp ' ,this.locationAvailabilityByProductBreakUp);
    this.displaySecondOverlay=true;
    this.prepareSupplierLocationAvailDetailsTable(this.locationAvailabilityByProductBreakUp);
  }




  prepareSupplierLocationAvailDetailsTable(response) {
    
    this.refreshSupplierLocationAvailDetailsTableHeader();
    this.refreshSupplierLocationAvailDetailsTable(response); 
  }
  refreshSupplierLocationAvailDetailsTableHeader(){
    this.modelSecondOverylay.header = [
      [
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.LOCATION'),
          sortable: false, style: {}
        }),
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY'),
          sortable: false, style: {}
        }),
      ]
    ];
  }
 
  refreshSupplierLocationAvailDetailsTable(response) {
    this.isScreenInitialized = false;
    this.modelSecondOverylay.pageLength = this.pageSize;
    this.modelSecondOverylay.currentPage = this.pageNumber;
    this.modelSecondOverylay.data = response.map(supplier => this.createSupplierLocationAvailDetailsTableRow(supplier));
    this.modelSecondOverylay.totalDataLength = response.length;
    this.isScreenInitialized = true;
  }

  createSupplierLocationAvailDetailsTableRow(supplier) {
     
    const tableRow = [
      {
        data: supplier.shipNodeLocation
      },
      {
        data: supplier.availableQuantity
      } 
    ];
    return tableRow;
  }
  //Populate Supplier Location ends
  

  onSelectedItems(e) { 
    console.log('onSelectedItems', e );
  }
  onSelectPage(e){}
  onSort(e){}
  selectRows(e){
    console.log('selectRows',e);
  }
  

  OpenSupplierRecordOverlay(map,event){
   this.selectedSupplierId = event.originalTarget.textContent.substring(
                              event.originalTarget.textContent.lastIndexOf("(") + 1, 
                              event.originalTarget.textContent.lastIndexOf(")") 
                              );
    console.log('Supplier Record to display for ',this.selectedSupplierId);
    this.allSuppliers.forEach(line => {
      if (line.supplier_id === this.selectedSupplierId) {
        this.fetchSupplierDetails();        
      }
    });
  }

  OpenSupplierLocationOverlay(m,event){ 
  this.userSelectedChildItemId = event.originalTarget.textContent.substring(
                                  event.originalTarget.textContent.lastIndexOf("(") + 1, 
                                  event.originalTarget.textContent.lastIndexOf(")") 
                                );
    console.log('Selected Item to show up availability by Location ',this.userSelectedChildItemId);
    this.availabilityByProductBreakUp.forEach(line => {
      if (line.itemId === this.userSelectedChildItemId) {
        console.log('Call fetchSupplierLocationRecord');
        this.fetchSupplierLocationRecord();
      }
    });
  } 

  backSupplierLocation(){
    this.displaySecondOverlay = false;
    this.displayFirstOverlay = true;
  }

  back(){
    this.displayFirstOverlay = false; 
  }

}
 