// -----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// 5737-D18
//
// (C) Copyright IBM Corp. 2018-2020 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
// -----------------------------------------------------------------

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { BaseModal } from 'carbon-components-angular';

@Component({
  selector: 'buc-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent extends BaseModal implements OnDestroy, OnInit {

  private cb = false;
  displayData: any;
  buttonData: any;

  constructor(
    @Inject('displayData') public display,
    @Inject('buttonData') public button,
  ) {
    super();
    this.displayData = display;
    this.buttonData = button;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.buttonCallback();
  }

  private async buttonCallback() {
    if (!this.cb && this.buttonData.callback) {
      this.cb = true;
      await this.buttonData.callback();
    }
  }

  async onButton() {
    await this.buttonCallback();
    this.closeModal();
  }
}
