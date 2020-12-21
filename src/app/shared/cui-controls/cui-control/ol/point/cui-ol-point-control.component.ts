import {Component, Input, OnInit, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {NgModel} from '@angular/forms';
import {CuiControlComponent} from '../../cui-control.component';
import * as ASCII from '../../../services/cui/ascci.helper';
import {Coordinate} from '../../../cui-data';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';
import {ValidationErrors} from '@shared/cui-controls/directives/cui-validator/cui-validator.directive';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CoordinateReferenceSystem} from '@shared/cui-controls/cui-control/ol/line/cui-ol-line-control.component';

export const Y_KEY = 'y';
export const X_KEY = 'x';
export const Z_KEY = 'z';

@Component({
  selector: 'cui-ol-point-control',
  templateUrl: './cui-ol-point-control.component.html'
})
export class CuiOlPointControlComponent extends CuiControlComponent implements OnInit {
  @ViewChildren(NgModel)
  public inputs: QueryList<NgModel>;

  @Input()
  public CRS: CoordinateReferenceSystem;

  public modalRef: BsModalRef;

  public latitudeKey;
  public longitudeKey;

  public point: {x: number, y: number, z: number} = {x: 0, y: 0, z: 0};

  public validationsForSingleProp = [];

  public get latitudeInput(): NgModel | null {
    if (!this.inputs) {
      return null;
    }

    return this.inputs.find((input: NgModel) => input.name === this.latitudeKey);
  }

  public get longitudeInput(): NgModel | null {
    if (!this.inputs) {
      return null;
    }

    return this.inputs.find((input: NgModel) => input.name === this.longitudeKey);
  }

  constructor(private cuiModelHelper2: CuiModelHelper,
              private modalService: BsModalService
  ) {
    super(cuiModelHelper2);
  }

  ngOnInit() {
    super.ngOnInit();
    this.latitudeKey = this.key + '.' + Y_KEY;
    this.longitudeKey = this.key + '.' + X_KEY;
  }

  public GetLatitudeValue(): any {
    this.point.y = this.cuiModelHelper2.GetModelValue(this.model, this.latitudeKey);
    return this.cuiModelHelper2.GetModelValue(this.model, this.latitudeKey);
  }

  public GetLongitudeValue(): any {
    this.point.x = this.cuiModelHelper2.GetModelValue(this.model, this.longitudeKey);
    return this.cuiModelHelper2.GetModelValue(this.model, this.longitudeKey);
  }

  transform(value: string): any {
    let result = '';
    let isPointInResult = false;
    for (const currentChar of value) {
      const currentCharCode = currentChar.charCodeAt(0);

      if (result.length === 0 && currentCharCode === ASCII.CHAR_MINUS) {
        result = '-';

        continue;
      }

      if (!ASCII.isDigit(currentCharCode)) {
        if (!isPointInResult && (currentCharCode === ASCII.CHAR_POINT || currentCharCode === ASCII.CHAR_COMA)) {
          result += '.';
          isPointInResult = true;
        }

        continue;
      }

      result += currentChar;
    }

    if (result[0] === '.') {
      result = '0' + result;
    }

    return result;
  }

  public SetLatitudeValue(value: any) {
    this.point.y = this.transform(value);
    this.changedByUser.emit(this.point);
  }

  public SetLongitudeValue(value: any) {
    this.point.x = this.transform(value);
    this.changedByUser.emit(this.point);
  }

  public GetLatitudeControlErrors(): ValidationErrors | null {
    const latitudeInput = this.latitudeInput;
    if (!latitudeInput) {
      return null;
    }

    return latitudeInput.control.errors;
  }

  public GetLatitudeClasses() {
    const latitudeInput = this.latitudeInput;
    if (!latitudeInput) {
      return ['', 'form-control'];
    }

    return [
      latitudeInput.dirty || latitudeInput.touched ? (latitudeInput.valid ? 'is-valid' : 'is-invalid') : '',
      'form-control',
    ];
  }

  public GetLongitudeControlErrors(): ValidationErrors | null {
    const longitudeInput = this.longitudeInput;
    if (!longitudeInput) {
      return null;
    }

    return longitudeInput.control.errors;
  }

  public GetLongitudeClasses() {
    const longitudeInput = this.longitudeInput;
    if (!longitudeInput) {
      return ['', 'form-control'];
    }

    return [
      longitudeInput.dirty || longitudeInput.touched ? (longitudeInput.valid ? 'is-valid' : 'is-invalid') : '',
      'form-control',
    ];
  }

  OpenModalForSelectCoordinatesOnMap(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg modal-dialog'});
  }

  ChangeValue(data: Coordinate) {
    this.cuiModelHelper.SetModelValue(this.model, this.key, data);
    this.changedByUser.emit(data);
    this.HideModal();
  }

  HideModal() {
    this.modalRef.hide();
  }
}
