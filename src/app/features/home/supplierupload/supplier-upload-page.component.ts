import { Component, OnInit, HostBinding } from '@angular/core';
import { S4SSearchService, PostSupplierInputList, PostSupplierInput, AddressAttrInput } from '../shared/rest-services/S4SSearch.service';
import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';
import { COMMON, BucTableModel, BucTableHeaderModel, BucNotificationModel, BucNotificationService } from '@buc/common-components';
import { TableHeaderItem } from 'carbon-components-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-page',
  templateUrl: './supplier-upload-page.component.html',
  styleUrls: ['./supplier-upload-page.component.scss']
})
export class SupplierUploadPageComponent implements OnInit {
  @HostBinding('class') page = 'page-component';
  private readonly nlsMap: any = {
    'SUPPLIERUPLOAD.LABEL_uploadSuccessful': '',
    'SUPPLIERUPLOAD.SKUID': '',
    'SUPPLIERUPLOAD.QUANTITY': '',
    'SUPPLIERUPLOAD.UOM': '',
    'SUPPLIERUPLOAD.NODEID': '',
    'SUPPLIERUPLOAD.PRODUCTCLASS': ''
    ,'SUPPLIERUPLOAD.SUPPLIERID': ''
    ,'SUPPLIERUPLOAD.MAILSLOTID':''
    ,'SUPPLIERUPLOAD.DESCRIPTION':''
    ,'SUPPLIERUPLOAD.CITY':''
  };
  private readonly reqCols = ['supplier_id'];
  private readonly columnNames: string[] = [];
  private pages = [];
  private pgLen = BucTableModel.DEFAULT_PAGE_LEN;
  private bucNS: BucNotificationService = new BucNotificationService();

  model: BucTableModel = new BucTableModel();
  headerModel: BucTableHeaderModel;

  constructor(
    private translateSvc: TranslateService,
    private supplierSvc: S4SSearchService
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
        new TableHeaderItem({ data: this.nlsMap['SUPPLIERUPLOAD.SUPPLIERID'] }),
        new TableHeaderItem({ data: this.nlsMap['SUPPLIERUPLOAD.MAILSLOTID'] }),
        new TableHeaderItem({ data: this.nlsMap['SUPPLIERUPLOAD.DESCRIPTION'] }),
        new TableHeaderItem({ data: this.nlsMap['SUPPLIERUPLOAD.CITY'] })
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
      this._createSupplier(records);
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
        { data: v.supplier_id },
        { data: v.supplier_mailslot_id },
        { data: v.description },
        { data: v.city }
      ];
    });
    this.model.totalDataLength = records.length;
    this.pages = COMMON.calcPagination(data, this.pgLen);
  }

  private async _createSupplier(records: any[]) {
    
    const body: PostSupplierInput[] = [];
    // const body: PostSupplierInputList = { supplier }; 
    const tenantId = BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId();
    const params: any = {
      body,
      tenantId
    };
    let supInput: PostSupplierInput;
    let addAttr = [];

    records.forEach(v => {
      addAttr = [{
        "name": "address_line_1",
        "value": v.address_line_1
    },
    {
        "name": "city",
        "value": v.city
    },
    {
        "name": "state",
        "value": v.state
    },
    {
        "name": "zipcode",
        "value": v.zipcode
    },
    {
        "name": "contact_person",
        "value": v.contact_person
    },
    {
        "name": "phone_number",
        "value": v.phone_number
    },
    {
        "name": "country",
        "value": v.country
    }]
      supInput = {
        supplier_id: v.supplier_id,
        description: v.description,
        supplier_type: v.supplier_type,
        supplier_mailslot_id: v.supplier_mailslot_id,
        supplier_url: v.supplier_url,
        contact_email: v.contact_email,
        contact_person: v.contact_person,
        supplier_twitter: v.supplier_twitter,
        tenant_id:tenantId,
        address_attributes:addAttr
      };
      // supplier.push(supInput);  
      body.push(supInput);   
    });

    try {
     await this.supplierSvc.postSuppliers(params).toPromise();
    this._showSuccess('', this.nlsMap['SUPPLIERUPLOAD.LABEL_uploadSuccessful']);
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
