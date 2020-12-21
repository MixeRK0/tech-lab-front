import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {EditableProperty, Property} from '../../index';
import {CuiModelHelper} from "../../../services/cui/cui.helper";

export interface SimpleDataTableCellConfig<TYPE> {
  properties: Property<TYPE>[],
  data?: (item: any) => Array<TYPE>,
  newItem?: (item: any) => TYPE,
  context?: (item: TYPE) => any,
  isDisableDeleting?: boolean
}

@Component({
  selector: 'cui-data-table-simple-cell',
  templateUrl: './cui-data-table-simple-cell.component.html',
  styleUrls: [
    '../../../css/cui-data-table-simple-cell.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class CuiDataTableSimpleCellComponent<TYPE> implements OnInit {
  @Input() public config: SimpleDataTableCellConfig<TYPE>;

  @Input() public set model(model: TYPE) {
    this.innerModel = model;
  };

  @Input() public set value(value) {
    this.list = value;
  };

  @Input() public label: string;

  @Input() public isEditable;

  @Input() public IsWithoutLabel = false;

  @Input() public isNeedUnitLabelForHeaders;

  @Input() public isResponsiveTable;

  @Input() public mainDivClass = 'row';

  @Input() public tableClass = 'table table-responsive-md';

  @Output() public changedByUser = new EventEmitter<any>();

  public list = [];

  public innerModel: TYPE;

  constructor(public cuiModelHelper: CuiModelHelper) { }

  ngOnInit() {
    if (this.config.data && this.innerModel) {
      this.config.data(this.innerModel)
    }

    if (this.isEditable === undefined) {
      this.isEditable = true;
    }

    if (this.isNeedUnitLabelForHeaders === undefined) {
      this.isNeedUnitLabelForHeaders = true;
    }
  }

  public ChangedByUser(indexOfItem, value, property: EditableProperty<TYPE>) {
    this.cuiModelHelper.SetModelValue(this.list[indexOfItem], property.key, value);
    if (property.onUserChange) {
      property.onUserChange(this.list[indexOfItem], this.config.context, value);
    }

    this.changedByUser.emit(this.list);
  }

  DeleteItem(item: TYPE) {
    const index = this.list.indexOf(item);
    this.list.splice(index, 1);

    this.changedByUser.emit(this.list);
  }

  AddItem() {
    if (!this.list) {
      this.list = [];
    }

    this.list.push(this.config.newItem(this.innerModel));
  }

  ResolveUnitPostfix(property: Property<TYPE>) {
    if (!this.isNeedUnitLabelForHeaders) {
      return '';
    }

    if (!property.inputConfig || !property.inputConfig.unitName) {
      return '';
    }

    return ' (' + property.inputConfig.unitName + ')';
  }
}
