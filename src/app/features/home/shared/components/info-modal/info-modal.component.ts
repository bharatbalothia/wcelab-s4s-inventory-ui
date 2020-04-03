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

import { Component, OnInit, Inject } from '@angular/core';
import { BaseModal } from 'carbon-components-angular';

@Component({
  selector: 'buc-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent extends BaseModal implements OnInit {

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

  async onButton() {
    if (this.buttonData.callback) {
      await this.buttonData.callback();
    }
    this.closeModal();
  }
}
