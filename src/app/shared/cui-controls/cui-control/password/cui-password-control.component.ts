import {Component, Input} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {CuiModelHelper} from "../../services/cui/cui.helper";
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'cui-password-control',
  templateUrl: './cui-password-control.component.html'
})
export class CuiPasswordControlComponent extends CuiControlComponent {
  @Input() valueForRepeat: string;
  @Input() minLengthPassword = 10;

  public formGroupWithUpdateOnBlur = new FormGroup({}, {updateOn: 'change'});

  public controlClass = 'col-12 input-group';

  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }
}
