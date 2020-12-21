import {Component, Input, OnInit} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

export const PROGRESSBAR_TYPE_INFO = 'info';
export const PROGRESSBAR_TYPE_WARNING = 'warning';
export const PROGRESSBAR_TYPE_SUCCESS = 'success';
export const PROGRESSBAR_TYPE_DANGER = 'danger';

@Component({
  selector: 'cui-progressbar-control',
  templateUrl: './cui-progressbar-control.component.html'
})
export class CuiProgressbarControlComponent extends CuiControlComponent implements OnInit {
  @Input() public isShowBarLabel;
  @Input() public isStriped;
  @Input() public isAnimate;

  @Input() public type;
  @Input() public barLabel;
  @Input() public max;

  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.isShowBarLabel === undefined) {
      this.isShowBarLabel = true;
    }
  }
}
