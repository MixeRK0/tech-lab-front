import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EditableProperty} from '../index';
import {Observable} from 'rxjs';
import {IOption} from "../../cui-control/select/cui-select-control.component";
import {CuiModelHelper} from "../../services/cui/cui.helper";
import {CuiControlComponent} from "../../cui-control/cui-control.component";

@Component({
  selector: 'cui-data-editable-cell',
  templateUrl: './cui-data-editable-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuiDataEditableCellComponent<TYPE> implements OnInit {
  @ViewChild(CuiControlComponent)
  public cuiInput: CuiControlComponent;

  @Input() public property: EditableProperty<TYPE>;

  @Input() public model: TYPE;

  @Input() public value;

  @Input() public inComplex: boolean;

  @Input() public labelCol: string;

  @Input() public inputCol;

  @Input() public context;

  @Output() public changedByUser = new EventEmitter<any>();

  public typeaheadInitSearchValue;

  private _selectOptions: Observable<IOption[]>;

  public ChangeByUser(value) {
    if (this.property.onUserChange) {
      this.property.onUserChange(this.model, this.context, value);
    }

    if (this.property.modifyValue) {
      value = this.property.modifyValue(this.model, value);
    }

    this.changedByUser.emit(value);
  }

  public IsValid(): boolean {
    return this.cuiInput ? this.cuiInput.input.valid : true;
  }

  public IsTouched(): boolean {
    return this.cuiInput ? this.cuiInput.input.touched : false;
  }

  public ResolveLabel(): string {
      if (this.inComplex) {
          return this.property.label;
      } else {
          return null
      }
  }

  public ResolveControlClass(): string {
    if (this.inComplex) {
      return 'input-group col-' + this.inputCol;
    } else {
      return 'input-group'
    }
  }

  public ResolveLabelClass(): string {
      if (this.inComplex) {
          return 'col-form-label col-' + this.labelCol
      } else {
          return 'col-form-label col-3'
      }
  }

  public ResolveGroupClass(): string {
      if (this.inComplex) {
          return 'row'
      } else {
          return ''
      }
  }

  IsDisabledProperty(property: EditableProperty<TYPE>, model: TYPE) {
    return property.inputConfig && property.inputConfig.isDisabled ? property.inputConfig.isDisabled(model) : null
  }

  public GetSelectOptions(): Observable<IOption[]> {
    if (this._selectOptions === undefined) {
      this._selectOptions = this.property.inputConfig.select.options(this.model, this.context);
    }

    return this._selectOptions;
  }

  constructor(private cdr: ChangeDetectorRef, public cuiModelHelper: CuiModelHelper) {}

  ngOnInit() {
    if (this.isInitSearchValueExist()) {
      this.property.inputConfig.typeahead
        .initSearchValue(this.model)
        .subscribe(
          value => {
            this.typeaheadInitSearchValue = value;
            this.cdr.detectChanges();
          }
        );
    }
  }

  isInitSearchValueExist() {
    return this.property.inputConfig
      &&  this.property.inputConfig.typeahead
      && this.property.inputConfig.typeahead.initSearchValue
  }
}
