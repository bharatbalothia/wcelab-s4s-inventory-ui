import { Component, OnInit, HostBinding } from '@angular/core';
import { AdjustSupplyList, AdjustSupply, SupplyService } from '../shared/rest-services/Supply.service';
import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';
import { COMMON, BucTableModel, BucTableHeaderModel, BucNotificationModel, BucNotificationService } from '@buc/common-components';
import { TableHeaderItem } from 'carbon-components-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent implements OnInit {
  @HostBinding('class') page = 'page-component';
  private readonly nlsMap: any = {
    'UPLOAD.LABEL_uploadSuccessful': '',
    'UPLOAD.SKUID': '',
    'UPLOAD.QUANTITY': '',
    'UPLOAD.UOM': '',
    'UPLOAD.NODEID': '',
    'UPLOAD.PRODUCTCLASS': ''
  };
  private readonly reqCols = ['sku', 'nodeid', 'quantity'];
  private readonly columnNames: string[] = [];
  private pages = [];
  private pgLen = BucTableModel.DEFAULT_PAGE_LEN;
  private bucNS: BucNotificationService = new BucNotificationService();

  model: BucTableModel = new BucTableModel();
  headerModel: BucTableHeaderModel;

  constructor(
    private translateSvc: TranslateService,
    private suppSvc: SupplyService
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
        new TableHeaderItem({ data: this.nlsMap['UPLOAD.SKUID'] }),
        new TableHeaderItem({ data: this.nlsMap['UPLOAD.NODEID'] }),
        new TableHeaderItem({ data: this.nlsMap['UPLOAD.QUANTITY'] }),
        new TableHeaderItem({ data: this.nlsMap['UPLOAD.UOM'] }),
        new TableHeaderItem({ data: this.nlsMap['UPLOAD.PRODUCTCLASS'] })
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
      this._adjustSupply(records);
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
      this.columnNames.push(... columns);
    }

    return rc;
  }

  private _loadTable(records) {
    const data = records.map(v => {
      return [
        { data: v.sku },
        { data: v.nodeid },
        { data: v.quantity },
        { data: v.unitofmeasure || 'EACH' },
        { data: v.productclass || '' }
      ];
    });
    this.model.totalDataLength = records.length;
    this.pages = COMMON.calcPagination(data, this.pgLen);
  }

  private async _adjustSupply(records: any[]) {
    const supplies: AdjustSupply[] = [];
    const body: AdjustSupplyList = { supplies };
    const tenantId = BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId();
    const params: any = {
      body,
      tenantId
    };
    let adj: AdjustSupply;

    records.forEach(v => {
      adj = {
        itemId: v.sku,
        shipNode: v.nodeid,
        changedQuantity: v.quantity,
        type: 'ONHAND',
        productClass: v.productclass || '',
        unitOfMeasure: v.unitofmeasure || 'EACH',
        eta: '',
        shipByDate: '',
      };
      supplies.push(adj);
    });

    try {
      await this.suppSvc.postByTenantIdV1Supplies(params).toPromise();
      this._showSuccess('', this.nlsMap['UPLOAD.LABEL_uploadSuccessful']);
      this._loadTable(records);
      this.onSelectPage(1);
    } catch (r) {
      const error = r.error ? r.error.error_message : r.message;
      this._showError('', error);
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

}
