import {Component} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
  selector: 'cui-datetimepicker-control',
  templateUrl: './cui-datetimepicker-control.component.html'
})
export class CuiDatetimepickerControlComponent extends CuiControlComponent {
  public minDate = '1900-01-01T00:00:00';
  public maxDate = '2100-01-01T00:00:00';

  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }
}
