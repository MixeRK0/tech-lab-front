import {Component} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
    selector: 'cui-label-control',
    templateUrl: './cui-label-control.component.html'
})
export class CuiLabelControlComponent extends CuiControlComponent {
  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }
}
