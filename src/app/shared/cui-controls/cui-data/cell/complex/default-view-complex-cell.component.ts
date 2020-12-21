import {Component, EventEmitter, OnInit} from '@angular/core';
import {ComponentForDynamicInsert} from "../../dynamic-container/dynamic-container.component";
import {Property} from "../../index";
import {CuiModelHelper} from "../../../services/cui/cui.helper";

@Component({
  selector: 'default-view-cell',
  template: `
      <div class="modal-header">
          <h4 class="modal-title pull-left">{{property.label}}</h4>
      </div>

      <div class="modal-body">
          <div *ngIf="property && model && innerProperties" class="p-4">
              <div *ngFor="let innerProperty of innerProperties" class="item-in-complex">
                  <div class="mb-1" *ngIf="innerProperty.is_editable">
                      <cui-data-editable-cell [property]="innerProperty"
                                              [value]="cuiModelHelper.GetModelValue(model, innerProperty.key)"
                                              [model]="model"
                                              [inComplex]="true"
                                              [labelCol]="property.inputConfig.complex.labelCol"
                                              [inputCol]="property.inputConfig.complex.inputCol"
                                              (changedByUser)="EmitChangedByUser($event, innerProperty.key)"
                      >
                      </cui-data-editable-cell>
                  </div>

                  <div class="mb-1" *ngIf="!innerProperty.is_editable">
                      <cui-data-read-only-cell [property]="innerProperty"
                                               [model]="model"
                                               [inComplex]="true"
                                               [labelCol]="property.inputConfig.complex.labelCol"
                                               [inputCol]="property.inputConfig.complex.inputCol"
                                               [label]="innerProperty.label"
                      >
                      </cui-data-read-only-cell>
                  </div>
              </div>
          </div>
      </div>
      <div class="modal-footer">
          <button class="btn btn-success col-1"
                  (click)="HideModal()"
          >ОК
          </button>
      </div>
  `
})
export class DefaultViewComplexCellComponent<TYPE> implements ComponentForDynamicInsert, OnInit {
  public property: Property<TYPE>;
  public model: TYPE;
  public value: any;
  public modalRef: any;
  public isChangedByUserOnModalHide: boolean;
  public innerProperties;

  public changedByUser = (value: any) => {
  };

  SetData(data: any) {
    this.property = data['property'];
    this.model = data['model'];
    this.modalRef = data['modalRef'];
    this.changedByUser = data['onChange'];
    this.isChangedByUserOnModalHide = data['isChangedByUserOnModalHide'];

    this.value = this.cuiModelHelper.GetModelValue(<Object>this.model, this.property.key);
  }

  HideModal() {
    if (this.isChangedByUserOnModalHide) {
      this.changedByUser(this.cuiModelHelper.GetModelValue(<Object>this.model, this.property.key));
    }

    this.modalRef.hide();
  }

  EmitChangedByUser(value: any, key: string) {
    this.cuiModelHelper.SetModelValue(<Object>this.model, key, value);

    if (this.isChangedByUserOnModalHide !== true) {
      this.changedByUser(this.cuiModelHelper.GetModelValue(<Object>this.model, this.property.key));
    }
  }

  constructor(public cuiModelHelper: CuiModelHelper) { }

  ngOnInit(): void {
    this.innerProperties = this.property.inputConfig.complex.innerProperties(this.model);
  }
}
