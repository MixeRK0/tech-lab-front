import {Component} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
  selector: 'cui-text-control',
  templateUrl: './cui-text-control.component.html'
})
export class CuiTextControlComponent extends CuiControlComponent {
  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }
}
