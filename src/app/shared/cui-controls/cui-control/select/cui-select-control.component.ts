import {Component, Input, OnInit} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import {Observable} from 'rxjs';
import {of} from 'rxjs';
import {ComponentForDynamicInsert} from '@shared/cui-controls/cui-data/dynamic-container/dynamic-container.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

export interface IOption {
  value: any,
  label: string,
  data?: object
}

@Component({
  selector: 'cui-select-control',
  templateUrl: './cui-select-control.component.html',
  styleUrls: ['../../css/cui-select-control.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuiSelectControlComponent extends CuiControlComponent implements OnInit {
  @Input() public options: Observable<IOption[]> = of([]);
  @Input() public isMultiple: boolean;
  @Input() public isHideSelectedOptions: boolean;
  @Input() public isShowAll: boolean;

  @Input() public componentForOptions: ComponentForDynamicInsert;
  @Input() public componentForOptionGroups: ComponentForDynamicInsert;
  @Input() public componentForLabel: ComponentForDynamicInsert;

  public isClosedMore = true;

  public items: Observable<IOption[]>;

  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.items = this.options;
  }
}
