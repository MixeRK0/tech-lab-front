import {Component, EventEmitter, Input} from '@angular/core';
import {ComponentForDynamicInsert} from "../../dynamic-container/dynamic-container.component";
import {Property} from "../../index";
import {CuiModelHelper} from "../../../services/cui/cui.helper";

@Component({
  selector: 'table-view-complex-cell',
  template: `      
        <div class="col-12 p-0">
            <table class="table table-responsive-md">
                <tbody>
                    <tr *ngFor="let innerProperty of property.inputConfig.complex.innerProperties(model)">
                        <td class="border col-3 p-2">
                            <label><strong>{{ResolveLabel(innerProperty)}}</strong></label>
                        </td>
                        <td class="border col-9" *ngIf="innerProperty.is_editable">
                            <cui-data-editable-cell [property]="innerProperty"
                                                    [value]="cuiModelHelper.GetModelValue(model, innerProperty.key)"
                                                    [model]="model"
                                                    (changedByUser)="EmitChangedByUser($event, innerProperty.key)"
                            >
                            </cui-data-editable-cell>
                        </td>
                        <td class="border col-9" *ngIf="!innerProperty.is_editable">
                            <cui-data-read-only-cell [property]="innerProperty"
                                                     [model]="model"
                                                     [inComplex]="true"
                                                     [inComplexTable]="true"
                            >
                            </cui-data-read-only-cell>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
  `
})
export class TableViewComplexCellComponent<TYPE> {
  @Input() public property: Property<TYPE>;

  @Input() public model: TYPE;

  @Input() public value: any;

  @Input() public changedByUser = (value: any) => { };

  public modalRef: any;

  EmitChangedByUser(value: any, key: string) {
    this.cuiModelHelper.SetModelValue(<Object>this.model, key, value);
    this.changedByUser(this.cuiModelHelper.GetModelValue(<Object>this.model, this.property.key));
  }

  constructor(public cuiModelHelper: CuiModelHelper) { }

  public ResolveLabel(property: Property<TYPE>) {
    let label = property.label;
    if (this.property.inputConfig.complex.isNeedUnitInHeader && property.inputConfig && property.inputConfig.unitName) {
      label = label + ' (' + property.inputConfig.unitName + ')';
    }

    return label;
  }
}
