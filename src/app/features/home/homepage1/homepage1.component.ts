import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

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
  tableHeaderModel = new BucTableHeaderModel();
  tableToolbarModel = new BucTableToolbarModel();
  tableFilterModel = new BucTableFilterModel();

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
  
  public dgNodes = [];
  public errorMessage = '';
  public isDGSelected = false;
  public selectedDG;
  public selectedCategory;
  public selectedProductId;
  public nodeAvailability: any;

  private topItemIds = ['012', '013', '014', '015', '018'];
  private uoms = ['EACH', 'EACH', 'EACH', 'EACH', 'EACH'];

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
    this.tableToolbarModel = new BucTableToolbarModel();
    this.model.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
    this.model.currentPage = 1;
    this.pageSize = this.model.pageLength;
    this.pageNumber = this.model.currentPage;

    if (!this.isScreenInitialized) {
      //this.initializeDGListDropDown();
      
      this.initializeCategoriesListDropDown();
       this.fetchAllSuppliers();

   /*   if(false){
        this.categoryListValues.push(  {
          content: "Category 1",
          id: "Category 1",
          selected: true
        });
        this.productListValues.push(  {
          content: "Category 1",
          id: "Category 1",
          selected: true
        });
        this.productListValues.push(  {
          content: "Category 2",
          id: "Category 2",
          selected: true
        });
        this.isScreenInitialized = true;
      }*/
    

    }

  }

  async initializeDGListDropDown() {
    const dgList = await this.invDistService.getDistributionRuleListByPage().toPromise();
    const filteredDGList = [];
    dgList.distributionGroups.map((dg) => {
      if (dg.dgId.startsWith(this.countyPrefix) || dg.dgId.startsWith(this.regionPrefix)) {
        dg.dgName = dg.dgName.split('_')[1];
        filteredDGList.push(dg);
      }
    });
    this.dgListValues = filteredDGList.map((dg) => {
      return {
        content: dg.dgName,
        id: dg.dgId,
        selected: false
      };
    });

    this.isScreenInitialized = true;
  }
  
  

  private async initDGNodes() {
    for (const dg of this.dgListValues) {
      const newDG: any = {};
      const response = await this.invDistService.getDistributionRuleDetails(dg.id).toPromise();   

      const nodes = [];
      if (response.length > 0) {
        nodes.push(response.map(node => node.shipNode));
      }

      newDG.distributionGroupId = dg.id;
      newDG.shipNodes = nodes[0];
      this.dgNodes.push(newDG);
    }
    console.log('this.dgNodes set to ', this.dgNodes);
  }

  async initializeTable(data) {
    if (data && data.lines) {
      const response = data.lines;
      this.prepareTable(response);
    }
  }

  prepareTable(response) {
    this.model.header = [
      [
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_ITEMS'),
          sortable: false, style: {}
        }),
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_AVAILABILITY'),
          sortable: true, style: {}
        }),
        new TableHeaderItem({
          data: this.translateService.instant('LIST_TABLE.HEADER_DEMAND'),
          sortable: true, style: {}
        }),
      ]
    ];
    this.refreshTable(response);
  }


  refreshTable(data) {
    this.isScreenInitialized = false;
    this.model.pageLength = this.pageSize;
    this.model.currentPage = this.pageNumber;
    this.model.data = data.map(item => this.createTableRow(item));
    this.model.totalDataLength = data.length;
    this.isScreenInitialized = true;
  }

  createTableRow(item) {
    const itemId = this._trimLineId(item.lineId);
    const tableRow = [
      {
        data: itemId
      },
      {
        /* Temporarily removing the following mapping - Calculating mapping from Nodes Availability */

        // data: (item.shipNodeAvailability && item.shipNodeAvailability.length > 0) ?
        //   this._calcTotalAvailability(item.shipNodeAvailability) : 0,
        data: this._calcTotalAvailability(item.lineId, this.nodeAvailability),
      },
      {
        data: item.demandData
      }
    ];
    return tableRow;
  }

   

  private _trimLineId(lineId) {
    if (lineId) {
      return lineId.split('_')[0];
    }
  }

  private _calcTotalAvailability(lineId, nodes) {
    let total = 0;
    nodes.lines.forEach(line => {
      if (line.lineId === lineId) {
        line.shipNodeAvailability.forEach(node => {
          total += Number(node.totalAvailableQuantity);
        });
      }
    });
    return total;
  }


  private async _getDemandTotalForItem(lineId, nodes) {
    const nodeList = nodes.lines.filter(l => l.lineId === lineId);
    const nodeIdNamePair = [];
    const itemId = this._trimLineId(lineId);
    nodeList[0].shipNodeAvailability.forEach(el => {
      const nodeIdPair = { id: itemId, shipNode: el.shipNode };
      nodeIdNamePair.push(nodeIdPair);
    });
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < nodeIdNamePair.length; index++) {
      const el = nodeIdNamePair[index];
      const res = await this._getInvDemand(el.id, el.shipNode);
      if (res && res.length > 0) {
        let qty = 0;
        res.forEach(r => {
          qty += Number(r.quantity);
        });
        el.quantity = qty;
      }
    }
    return this._getTotal(nodeIdNamePair);
  }

  private _getTotal(nodes) {
    let totalQty = 0;
    if (nodes && nodes[0].quantity) {
      nodes.forEach(n => { if (n.quantity) { totalQty += n.quantity; } });
    }
    return totalQty;
  }

  public searchChange(value: string) {
    this.searchValue = value;
  }

  public searchClear() {
    this.searchValue = '';
  }

  public selectDG(event) {
    this.selectedDG = event.item.id;

    if (this.selectedDG !== '') {
      this._getNetworkAvailability(this.selectedDG);
      this.isDGSelected = true;
    }
  }

  

  private async _getNetworkAvailability(dg) {
    // Temporarily using Node Availability
    try {
      await this.initDGNodes();
      let nodes: any[];
      for (const currentdg of this.dgNodes) {
        if (currentdg.distributionGroupId === dg) {
          nodes = currentdg.shipNodes;
          break;
        }
      }

      const tempNodeData =
        await this.invAvailService.getInventoryForNodes(this.topItemIds, nodes, this.uoms, []).toPromise();
      console.log('DATA FROM NODES', tempNodeData);
      this.nodeAvailability = tempNodeData;
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < tempNodeData.lines.length; index++) {
        tempNodeData.lines[index].demandData = await this._getDemandTotalForItem(tempNodeData.lines[index].lineId, this.nodeAvailability);
      }
      this.initializeTable(tempNodeData);
    } catch (err) {
      console.log('Error fetching availability: ', err);
    }
  }

  private async _getInvDemand(skuId, skuNode) {
    try {
      const demandData = await this.invDemandService.getDemandByAllTypes(skuId, skuNode, '', 'EACH', '').toPromise();
      return demandData;
    } catch (err) {
      console.log('Error fetching demand data: ', err);
    }
  }


  async initializeCategoriesListDropDown() {
    const responses4s = await this.invDistService.getAllCategories( ).toPromise();
    const allCategories = [];
    if (responses4s.length > 0) {
      for (const category of responses4s) {
        allCategories.push(category); 
      }
    }
    console.log('Padman allCategories', allCategories) ;   
    this.categoryListValues = allCategories.map((category) => {
      return {
        content: category.category_id,
        id: category._id,
        selected: false
      };
    });
     
    this.isScreenInitialized = true;
  }
  
  //Padman: Fetch All Products By Category
  public fetchAllProductsByCategoryId(event) {
    console.log('fetchAllProductsByCategoryId starts')
    this.selectedCategory = event.item.content;
    console.log('selectedCategory ', this.selectedCategory, event.item.content );
    console.log('selectedCategory ', this.selectedCategory);
    if (this.selectedCategory !== '') {
      this._getAllProductsByCategoryId(this.selectedCategory);
      this.isDGSelected = true;
    }
  }

  private async _getAllProductsByCategoryId(selectedCategory) {
    // Temporarily using Node Availability
    try {
      const responses4s = await this.invDistService.getAllProductsByCategoryId( selectedCategory ).toPromise();
      const allProducts = [];
      if (responses4s.length > 0) {
        for (const product of responses4s) {
          allProducts.push(product); 
        }
      }
      console.log('Padman Products', allProducts) ;   
      this.productListValues = allProducts.map((product) => {
        return {
          content: product.item_id,
          id: product._id,
          selected: false
        };
      });
      
     
      console.log('productListValues to ' ,this.productListValues)
    } catch (err) {
      console.log('Error fetching availability: ', err);
    }
  }

  
  //Padman: Fetch All Suppliers search by user selected ProductId 
  public fetchAllSuppliersByProductId(event) {
    console.log('fetchAllSuppliersByProductId starts')
    this.selectedProductId = event.item.content;
    console.log('selectedProductId ', this.selectedProductId );
     
    if (this.selectedProductId !== '') {
     this._getAllSuppliersByProductId(this.selectedProductId);
      
    }
  }

  private async _getAllSuppliersByProductId(selectedProductId) {
    try {
      const ivResponse = await this.invAvailService.getInventoryForDG( [selectedProductId], '3MC', ['UNIT'],['GOOD'] ).toPromise();
      //const responses4s = (GetSuppliersByProductIdJSON as any).default;
      this.parseInventoryForDGResponse(ivResponse) ;

      const allSuppliersHavingSelectedProduct = [];
      if (ivResponse.length > 0) {
        for (const supplier of ivResponse) {
          allSuppliersHavingSelectedProduct.push(supplier); 
        }
      }
      console.log('Padman allSuppliersHavingSelectedProduct', allSuppliersHavingSelectedProduct, ivResponse) ;   
      const allSuppliersSearchByProductId = allSuppliersHavingSelectedProduct.map((supplier) => {
        return {
          Supplier: supplier.Supplier,
          Availability: supplier.Availability,
          Date: supplier.Date
        };
      });
      console.log('allSuppliersSearchByProductId to ' ,this.allSuppliersSearchByProductId);
      this.prepareSupplierTable(allSuppliersSearchByProductId);
    } catch (err) {
      console.log('Error fetching availability: ', err);
    }
  }

  parseInventoryForDGResponse(ivResponse){
  
    // console.log('ivResponse', ivResponse);
    // console.log('ivResponse.lines.length', ivResponse.lines.length);

    // for (let index = 0; index < ivResponse.lines.length; index++) {
    //   console.log('ivResponse.lines[index].lineId', ivResponse.lines[index].lineId;
    // }
  }

  prepareSupplierTable(response) {
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
    this.refreshSupplierTable(response);
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

  async fetchAllSuppliers() {
    const responses4s = await this.invDistService.fetchAllSuppliers( ).toPromise();
    const suppliers = [];
    if (responses4s.length > 0) {
      for (const supplier of responses4s) {
        suppliers.push(supplier); 
      }
    }
    console.log('Padman suppliers', suppliers) ;   
    this.allSuppliers = suppliers.map((supplier) => {
      return {
        _id: supplier._id,
        supplier_id: supplier.supplier_id,
        description: supplier.description,
        supplier_type: supplier.supplier_type,
        address_attributes: []
      };
    });
    console.log('Padman allSuppliers', this.allSuppliers) ;   
  }

  // functions added for AOT compiler -- template should either remove mention of these functions or implement
  //   them fully
  onSelectedItems(e) {
  }

  onSort(e) {
  }

  onSelectPage(e) {
  }

  selectRows(e) {
  }
}
