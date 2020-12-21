import {Component} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
  selector: 'cui-timepicker-control',
  templateUrl: './cui-timepicker-control.component.html',
})
export class CuiTimepickerControlComponent extends CuiControlComponent {
  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }
}
