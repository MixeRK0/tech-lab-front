import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, Validators} from '@angular/forms';
import {ValidationErrors} from './cui-validator.directive';

@Directive({
  selector: '[cuiPasswordValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: CuiPasswordValidatorDirective, multi: true}]
})
export class CuiPasswordValidatorDirective implements Validator {
  @Input() public minLengthPassword = 8;
  @Input() public valueForRepeat: string;

  validate(control: AbstractControl): ValidationErrors | null {
    if (Validators.minLength(this.minLengthPassword)(control)) {
      return {
        password: {
          message: 'Пароль должен быть не менее ' + this.minLengthPassword + ' символов'
        }
      };
    }

    if (this.valueForRepeat !== undefined && control.value !== this.valueForRepeat) {
      return {
        password: {
          message: 'Пароли не совпадают'
        }
      };
    }

    return null;
  }
}
