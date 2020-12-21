import {Component, OnInit} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
  selector: 'cui-telephone-control',
  templateUrl: './cui-telephone-control.component.html'
})
export class CuiTelephoneControlComponent extends CuiControlComponent implements OnInit {
  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }
}
