import {Component, ViewChild} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'cui-email-control',
  templateUrl: './cui-email-control.component.html'
})
export class CuiEmailControlComponent extends CuiControlComponent {
  @ViewChild(NgModel)
  public input: NgModel;

  public controlClass = 'col-12 input-group';

  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }
}
