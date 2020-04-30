import { Component, OnInit, HostBinding } from '@angular/core';
import { AdjustDemandList, AdjustDemand, DemandService } from '../shared/rest-services/Demand.service';
import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';
import { COMMON, BucTableModel, BucTableHeaderModel, BucNotificationModel, BucNotificationService } from '@buc/common-components';
import { TableHeaderItem } from 'carbon-components-angular';
import { TranslateService } from '@ngx-translate/core';

import { S4SSearchService } from '../shared/rest-services/S4SSearch.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-demand-page.component.html',
  styleUrls: ['./upload-demand-page.component.scss']
})
export class UploadDemandPageComponent implements OnInit {
  @HostBinding('class') page = 'page-component';
  private readonly nlsMap: any = {
    'DEMANDUPLOAD.LABEL_uploadSuccessful': '',
    'DEMANDUPLOAD.SKUID': '',
    'DEMANDUPLOAD.QUANTITY': '',
    'DEMANDUPLOAD.UOM': '',
    'DEMANDUPLOAD.NODEID': '',
    'DEMANDUPLOAD.PRODUCTCLASS': '',
    'DEMANDUPLOAD.MODEL_NUMBER': '',
    'DEMANDUPLOAD.SHIP_BY_DATE': '',
    'DEMANDUPLOAD.SHIP_NODE': '',
    'DEMANDUPLOAD.BUYERID': '',
    'DEMANDUPLOAD.SUPPLIERID': '',
    'DEMANDUPLOAD.NEEDBYDATE': '',
    'DEMANDUPLOAD.CUSTOMERID': '',
    'DEMANDUPLOAD.LOCATIONID': '',
    'DEMANDUPLOAD.ITEMID': '',
    'DEMANDUPLOAD.AVAILABLEFROM': '',
    'DEMANDUPLOAD.UPLOAD_CUSTOM_ERROR_MSG': '',

  };

  private readonly reqCols = [
                              'buyerid',
                              'supplierid', 
                              'locationid', 
                              'itemid', 
                              'quantity', 
                              'uom', 
                              'needbydate'];

  private readonly columnNames: string[] = [];
  private pages = [];
  private pgLen = BucTableModel.DEFAULT_PAGE_LEN;
  private bucNS: BucNotificationService = new BucNotificationService();

  model: BucTableModel = new BucTableModel();
  headerModel: BucTableHeaderModel;

  user: { buyers: string[], suppliers: string[], connectedSuppliers: string[] };
  buyerList: any[] = [];
  buyer: string;

  constructor(
    private translateSvc: TranslateService,
    private demSvc: DemandService,
    private s4sSvc: S4SSearchService
  ) {
  }

  ngOnInit() {
    this._init();
  }

  onUpload(e) {
    this._clearTable();


    const f = e.target.files[0];
    const r = new FileReader();
    r.onload = () => this._parseFile(r);
    r.readAsText(f);
  }

  onSelectPage(pg) {
    this.model.isLoading = true;

    if (this.model.pageLength !== this.pgLen) {
      this.pages = COMMON.calcPagination(this.pages, this.model.pageLength);
    }
    this.pgLen = this.model.pageLength;
    this.model.currentPage = pg;
    this.model.data = this.pages[this.model.currentPage - 1];

    this.model.isLoading = false;
  }

  private async _init() {
    await this._initTranslations();
    this._initTable();
    await this._initUserDataAndFetchAllBuyers();
    if (this.buyerList.length === 1) {
      this.onbuyer({ item: this.buyerList[0] });
    }
  }

  private async _initTranslations() {
    const keys = Object.keys(this.nlsMap);
    const json = await this.translateSvc.get(keys).toPromise();
    keys.forEach(k => this.nlsMap[k] = json[k]);
  }

  private _initTable() {
    // note these headers are literals, hence not translatable
    this.model.header = [
      [
        new TableHeaderItem({ data: this.nlsMap['DEMANDUPLOAD.BUYERID'] }),
        new TableHeaderItem({ data: this.nlsMap['DEMANDUPLOAD.SUPPLIERID'] }),
        new TableHeaderItem({ data: this.nlsMap['DEMANDUPLOAD.LOCATIONID'] }),
        new TableHeaderItem({ data: this.nlsMap['DEMANDUPLOAD.ITEMID'] }),
        new TableHeaderItem({ data: this.nlsMap['DEMANDUPLOAD.QUANTITY'] }),
        new TableHeaderItem({ data: this.nlsMap['DEMANDUPLOAD.UOM'] }),
        new TableHeaderItem({ data: this.nlsMap['DEMANDUPLOAD.NEEDBYDATE'] })
      ]
    ];
    this.model.data = [];
    this.model.pageLength = this.pgLen;
    this.model.currentPage = 1;
    this.model.totalDataLength = 0;
  }

  private _clearTable() {
    this.pages = [];
    this.model.data = [];
    this.model.currentPage = 1;
    this.model.totalDataLength = 0;
  }

  private _parseFile(r: any) {
    const data: string[] = r.result.split(/\r?\n/);
    if (this._verifyHeader(data[0])) {
      const raw = data.slice(1);
      console.log('Found %s records (excluding header)', raw.length);
      const records = raw.map(record => {
        const rc = {};
        record.split(',').forEach((c, i) => rc[this.columnNames[i]] = c.trim());
        return rc;
      });
      console.log('Records are: %o', records);

      // TODO: display table
      this._adjustDemand(records);
    }
  }

  private _verifyHeader(header: string) {
    const columns = header.toLowerCase().split(',').map(v => v.trim());
    const map = COMMON.toMap(columns);
    let rc = true;

    this.reqCols.forEach(v => {
      if (!map[v]) {
        console.log('Missing required column: %o', v);
        rc = false;
      }
    });

    if (columns.length === 0) {
      console.log('Expected at least [%s] columns in CSV header with names: %o', this.reqCols.length, this.reqCols);
      console.log('CSV header was: %o', header);
      rc = false;
    }

    if (rc) {
      this.columnNames.push(...columns);
    }

    return rc;
  }


  private _loadTable(records) {
    const data = records.map(v => {
      return [
        { data: v.buyerid },
        { data: v.supplierid },
        { data: v.locationid },
        { data: v.itemid },
        { data: v.quantity },
        { data: v.uom || 'UNIT' },
        { data: v.needbydate },
      ];
    });
    this.model.totalDataLength = records.length;
    this.pages = COMMON.calcPagination(data, this.pgLen);
  }

  private async _adjustDemand(records: any[]) {
    const demands: AdjustDemand[] = [];
    const body: AdjustDemandList = { demands };
    const tenantId = BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId();
    const params: any = {
      body,
      tenantId
    };
    let adj: AdjustDemand;


    records.forEach(v => {
      if (this.buyer === v.buyerid) {
        console.log('Set the request body', this.buyer, v.buyerid);
        adj = {
          itemId: `${v.supplierid}::${v.itemid}`,
          shipNode: v.locationid,
          changedQuantity: v.quantity,
          productClass: v.productclass || 'NEW',
          type: "OPEN_ORDER",
          unitOfMeasure: v.uom || 'UNIT',
          cancelDate: v.cancelDate || '',
          shipDate: v.shipDate
        };
        demands.push(adj);
      } else {
        this._showError('', this.nlsMap['DEMANDUPLOAD.UPLOAD_CUSTOM_ERROR_MSG']);
      }
    });


    if (demands.length > 0) {
      try {
        console.log('_adjustDemand call to putByTenantIdV1Supplies : params', params);
        await this.demSvc.postByTenantIdV1Demands(params).toPromise();
        this._showSuccess('', this.nlsMap['DEMANDUPLOAD.LABEL_uploadSuccessful']);
        this._loadTable(records);
        this.onSelectPage(1);
      } catch (r) {
        const error = r.error ? r.error.error_message : r.message;
        this._showError('', error);
      }
    }

  }
  private _showSuccess(title, msg) {
    this._showNotification('success', title, msg, true);
  }

  private _showError(title, msg) {
    this._showNotification('error', title, msg, true);
  }

  private _showNotification(type, title, message, showClose = true) {
    const notification = new BucNotificationModel(
      {
        statusType: type,
        statusContent: message
      }
    );
    this.bucNS.send([notification]);
  }

  private async _initUserDataAndFetchAllBuyers() {
    const getValue = (attr, def = '-') => {
      return attr ? attr.value : def;
    };

    this.user = await this.s4sSvc.getUserInfo().toPromise();
    console.log('S4S response - _initUserDataAndFetchAllBuyers - getUserInfo', this.user);
    const obs = this.user.buyers.map(buyerId => this.s4sSvc.getContactDetailsOfSelectedBuyer({ buyerId }));
    const buyers = await forkJoin(obs).toPromise();
    console.log('S4S response - _initUserDataAndFetchAllBuyers - getContactDetailsOfSelectedBuyer combined', buyers);
    this.buyerList = buyers.map(s => ({ content: `${s.description} (${s.buyer_id})`, id: s.buyer_id }));
    console.log('Model - _initUserDataAndFetchAllBuyers S4S buyerList ', this.buyerList);

  }

  onbuyer(e) {
    const s = e.item ? e.item.id : undefined;
    if (s && s !== this.buyer) {
      this.buyer = s;
    }
  }

}
