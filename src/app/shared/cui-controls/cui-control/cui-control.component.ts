import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup, NgModel} from '@angular/forms';
import {CUI_VALIDATION, VALIDATIONS} from '../services/cui/form.helper';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
  selector: 'cui-input',
  template: ''
})
export class CuiControlComponent implements OnInit {
  @ViewChild(NgModel)
  public input: NgModel;

  @Input() public key = '';

  @Input() public value;

  @Input() public model: object = {};

  @Input() public validations: CUI_VALIDATION[] = [];

  @Input() public label = null;

  @Input() public unitName = null;

  @Input() public placeholder = '';

  @Input() public inputType = 'text';

  @Input() public controlClass = 'col-9 input-group';

  @Input() public labelClass = 'col-3 col-form-label';

  @Input() public unitNameClass = 'col-2 col-form-label text-left';

  @Input() public groupClass = 'form-group row vertical-center';

  @Input() public tabIndex;

  @Input() public isDisabled;

  @Input() public errorMessageInTooltip = false;

  @Input() public validationMessages = VALIDATIONS;

  @Input() public inputClass = 'form-control';

  @Output() public changedByUser = new EventEmitter<any>();

  public availableValidations = Object.keys(this.validationMessages);

  public formGroupWithUpdateOnBlur = new FormGroup({}, {updateOn: 'blur'});

  constructor(public cuiModelHelper: CuiModelHelper) {}

  ngOnInit(): void {
    if (this.input) {
      this.input.control.setParent(this.formGroupWithUpdateOnBlur);
    }
  }

  public EmitValueChanged(value: any) {
    if (!this.input) {
      return;
    }

    if (!this.input.control.pristine) {
      this.changedByUser.emit(value);
    }
  }

  public GetControl(): AbstractControl {
    if (!this.input) {
      return;
    }

    return this.input.control;
  }

  public GetInputClasses() {
    if (!this.input) {
      return;
    }

    return [
      this.input.dirty || this.input.touched ? (this.input.valid ? 'is-valid' : 'is-invalid') : '',
      this.inputClass,
    ];
  }

  GetErrorMessage() {
    if (!this.input) {
      return;
    }

    if (!(this.input.dirty || this.input.touched)) {
      return null;
    }

    const control = this.GetControl();

    if (!control || !control.errors) {
      return null;
    }

    let errorMessage = '';

    for (const validation of this.availableValidations) {
      if (control.errors[validation]) {
        errorMessage += this.validationMessages[validation].message + '\n';
      }
    }

    if (errorMessage === '') {
      return null;
    }

    return errorMessage;
  }
}
