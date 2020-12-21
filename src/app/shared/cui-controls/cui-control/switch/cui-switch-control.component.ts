import {Component, OnInit} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {FormGroup} from '@angular/forms';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
    selector: 'cui-switch-control',
    templateUrl: './cui-switch-control.component.html'
})
export class CuiSwitchControlComponent extends CuiControlComponent implements OnInit {
  public formGroupWithUpdateOnChange = new FormGroup({}, {updateOn: 'change'});

  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }

  ngOnInit() {
    if (this.input) {
      this.input.control.setParent(this.formGroupWithUpdateOnChange);
    }
  }
}
