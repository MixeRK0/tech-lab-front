import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
    selector: 'cui-datepicker-control',
    templateUrl: './cui-datepicker-control.component.html'
})
export class CuiDatepickerControlComponent extends CuiControlComponent implements OnInit, OnChanges {
  public minDate = '1900-01-01T00:00:00';
  public maxDate = '2100-01-01T00:00:00';

  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }

  ngOnInit(): void {
    this.FormatValue();
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.FormatValue()
  }

  FormatValue() {
    if (this.value) {
      this.value = this.value.toString().substr(0, 10);
    }
  }
}
