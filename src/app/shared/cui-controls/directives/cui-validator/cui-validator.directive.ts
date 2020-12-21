import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {VALIDATIONS} from "../../services/cui/form.helper";

export interface ValidationErrors {
  [key: string]: {message: string};
}

@Directive({
  selector: '[cuiValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: CuiValidatorDirective, multi: true}]
})
export class CuiValidatorDirective implements Validator {
  @Input() public validations: string[];

  validate(control: AbstractControl): ValidationErrors | null {
    const errors = {};

    if (!this.validations) {
      return null;
    }

    for (const validationName of this.validations) {
      if (validationName in VALIDATIONS) {
        const error = VALIDATIONS[validationName].validation(control);
        if (error) {
          Object.assign(errors, error);
        }
      }
    }

    if (Object.keys(errors).length === 0) {
      return null;
    }

    return errors;
  }
}
