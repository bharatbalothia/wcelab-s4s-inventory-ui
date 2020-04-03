import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BucTableHeaderModel,
  BucTableModel
} from '@buc/common-components';
import { ModalService, TableHeaderItem } from 'carbon-components-angular';
import { InfoModalComponent } from '../../shared/components/info-modal/info-modal.component';
import { InventoryDistributionService } from '../../shared/services/inventory-distribution.service';
import { InventoryAvailabilityService } from '../../shared/services/inventory-availability.service';
import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';

// tslint:disable-next-line:interface-over-type-literal
type DistributionGroupDetails = {
  'distributionGroupId' ?: string
  'shipNodes' ?: string[]
  'totalAvailable' ?: string,
  'childItemIds' ?: string[],
  'childItemTotals' ?: string[]
};

@Component({
    selector: 'app-item-dg-availability',
    templateUrl: './item-dg-availability.component.html',
    styleUrls: ['./item-dg-availability.component.scss'],
  })
export class ItemDGAvailabilityComponent implements OnInit {
  private CONST_COUNTY = 'County';
  private CONST_REGION = 'Region';
  private currentSearchItemId = null;
  private countyPrefix = 'CT_';
  private regionPrefix = 'REG_';
  private dgPrefix = this.countyPrefix;
  private selectedTab = this.CONST_COUNTY;
  public dgList = [];
  public tabData = [];

  model = new BucTableModel();
  tableHeaderModel = new BucTableHeaderModel();
  // tableToolbarModel = new BucTableToolbarModel();
  private pageSize;
  private pageNumber;

  // for AOT compiler -- template should probably remove mention of this double-binding (unused)
  private records: string[] = [];
  set selected(records) { this.records = records; }
  get selected() { return this.records; }
  searchValue = '';

  @ViewChild('invTable', { static: true }) invTableRef: TemplateRef<any>;
  @ViewChild('availability', { static: true }) private availability: TemplateRef<any>;
  @ViewChild('availWithLink', { static: true }) private availWithLink: TemplateRef<any>;
  @ViewChild('childItemModal', { static: true }) private childItemModal: TemplateRef<any>;

  constructor(
    private dgSvc: InventoryDistributionService,
    private availSvc: InventoryAvailabilityService,
    private translateSvc: TranslateService,
    private modalSvc: ModalService,
  ) {
  }

    ngOnInit() {
      this._init();
      this.prepareTabs();
    }

    async _init() {
      const resp = await this.dgSvc.getDistributionRuleListByPage().toPromise();
      this.getNodeDetails(resp);
      this.initializeTable();
    }

    async initializeTable() {
      this.model = new BucTableModel();
      // this.tableToolbarModel = new BucTableToolbarModel(); // do not pass it in html - avoids toolbar area.
      this.model.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
      this.model.currentPage = 1;
      this.pageSize = this.model.pageLength;
      this.pageNumber = this.model.currentPage;

      this.prepareTable();
    }

    prepareTable() {
      this.model.header = [
        [
          new TableHeaderItem({
            data: this.translateSvc.instant('FINDINVENTORY.NAME'),
            sortable: true, style: {}
          }),
          new TableHeaderItem({
            data: this.translateSvc.instant('FINDINVENTORY.AVAILABLE'),
            sortable: true, style: {}
          })
        ]
      ];
    }

    prepareTabs() {
      this.tabData = [{
        heading: this.translateSvc.instant('FINDINVENTORY.COUNTY'),
        content: this.invTableRef,
        active: this.selectedTab === this.CONST_COUNTY,
        handleSelected: () => { this.setSelectedTabAndRefreshTable(this.CONST_COUNTY); }
      }, {
        heading: this.translateSvc.instant('FINDINVENTORY.REGION'),
        content: this.invTableRef,
        active: this.selectedTab === this.CONST_REGION,
        handleSelected: () => { this.setSelectedTabAndRefreshTable(this.CONST_REGION); }
      }];
    }

    setSelectedTabAndRefreshTable(selectedTabName) {
      this.selectedTab = selectedTabName;
      // Right now, if it is null or empty string, show table as blank, else show data.
      if (!BucSvcAngularStaticAppInfoFacadeUtil.isVoid(this.currentSearchItemId)) {
        this.refreshTable(this.dgList);
      } else {
        // This can happen during initial state only - after that we will always have !isVoid() value for this.currentSearchItemId.
      }
    }

    refreshTable(data) {
      this.model.pageLength = this.pageSize;
      this.model.currentPage = this.pageNumber;
      this.model.data = data.map((item) => {
        return this.createTableRow(item);
      }).filter((item) => {
        return item != null;
      });
      // this.model.totalDataLength = data.length; // This sets unfiltered size
      this.model.totalDataLength = this.model.data.length;
    }

    createTableRow(item) {
      if (this.selectedTab === this.CONST_COUNTY) {
        this.dgPrefix = this.countyPrefix;
      } else {
        this.dgPrefix = this.regionPrefix;
      }
      if (item.distributionGroupId.startsWith(this.dgPrefix)) {
        const tableRow = [
          {
            data: item.distributionGroupId.substring(this.dgPrefix.length)
          },
          {
            data: { 'total': item.totalAvailable, 'childItemIds': item.childItemIds, 'childItemTotals': item.childItemTotals }, template: (item.childItemIds && item.childItemIds.length > 0)?  this.availWithLink : this.availability
          }
        ];
        return tableRow;
      } else {
        return null; // This avoids empty array and we can filter these. Else, we get gaps or multiple height rows in table.
      }
    }

    /**
     * Since availability/network IV service is not working for the tenant, need to apply a workaround
     * to get all ShipNodes that make up the Distribution Group and then use the availability/node IV
     * service instead.
     * @param res res param
     */
    private getNodeDetails(res) {
      res.distributionGroups.forEach((dg) => {
        if (dg.dgId.startsWith(this.countyPrefix) || dg.dgId.startsWith(this.regionPrefix)) {
          this.dgSvc.getDistributionRuleDetails(dg.dgId).toPromise().then(response => {
            const nodes = [];
            if (response.length > 0) {
              nodes.push(response.map(node => node.shipNode));
            }
            const newDG: DistributionGroupDetails = {
              distributionGroupId: dg.dgId,
              shipNodes: nodes[0]
            };
            this.dgList.push(newDG);
          });
        }
      });
    }

    public getAvailability(itemId) {
      this.currentSearchItemId = itemId;
      for (const dg of this.dgList) {
        this.availSvc.getInventoryBreakupForNodes(itemId[0], dg.shipNodes, 'EACH', '').toPromise().then(response => {
          let totalAvail = 0;
          if (response.lines[0].shipNodeAvailability.length > 0) {
            for (const shipNodeAvl of response.lines[0].shipNodeAvailability) {
              totalAvail = totalAvail + shipNodeAvl.totalAvailableQuantity;
            }
          }
          dg.totalAvailable = totalAvail;
          // have child items, save them to build table
          const childItems = [];
          const childTotals = [];
          if (response.lines.length > 1) {
            for (const childLine of response.lines) {
              if (childLine.lineId > 0) {
                childItems.push(childLine.itemId);
                let childTotalAvail = 0;
                for (const shipNodeAvl of childLine.shipNodeAvailability) {
                  childTotalAvail = childTotalAvail + shipNodeAvl.totalAvailableQuantity;
                }
                childTotals.push(childTotalAvail);
              }
            }
          }
          dg.childItemIds = childItems;
          dg.childItemTotals = childTotals;
          this.refreshTable(this.dgList);
        });
      }
    }

    public onViewChildItemModal(childItemIds, childItemTotals) {
      this.modalSvc.create({
        component: InfoModalComponent,
        inputs: {
          displayData: {
            size: 'sm',
            header: this.translateSvc.instant('FINDINVENTORY.REPLACEMENTITEMS'),
            template: this.childItemModal,
            templateData: {
              childItemIds: childItemIds,
              childItemTotals: childItemTotals
            }
          },
          buttonData: {
            primary: '',
            class: {
              primary: true
            },
            text: this.translateSvc.instant('FINDINVENTORY.CLOSE')
          }
        }
      });
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
