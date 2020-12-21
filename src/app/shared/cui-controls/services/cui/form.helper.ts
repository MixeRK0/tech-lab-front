import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export function validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
            control.updateValueAndValidity({ onlySelf: true });
            control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
            validateAllFormFields(control);
            control.updateValueAndValidity({ onlySelf: true });
        }
    });
 // this.validateAllFormFields(formGroup);
}

export const EMAIL = 'email';
export const INTEGER = 'integer';
export const DECIMAL = 'decimal';
export const POSITIVE_INTEGER = 'positive_integer';
export const POSITIVE_DECIMAL = 'positive_decimal';
export const REQUIRED = 'required';

export type CUI_VALIDATION = 'integer' | 'decimal' | 'positive_integer' | 'positive_decimal' | 'required' | 'email' ;

export const VALIDATIONS: {[name: string]: {validation: any, message: string}} = {
    [INTEGER]: {
        validation: (control: AbstractControl): ValidationErrors | null => {
            return Validators.pattern('[-+]?[0-9]+')(control) ? {[INTEGER]: true} : null;
        },
        message: 'Необходимо ввести целое число'
    },
    [DECIMAL]: {
        validation: (control: AbstractControl): ValidationErrors | null => {
            return Validators.pattern('[-+]?([0-9]+[.])?[0-9]+')(control) ? {[DECIMAL]: true} : null;
        },
        message: 'Необходимо ввести дробное число'
    },
    [POSITIVE_INTEGER]: {
        validation: (control: AbstractControl): ValidationErrors | null => {
            return Validators.pattern('[0-9]+')(control) ? {[POSITIVE_INTEGER]: true} : null;
        },
        message: 'Необходимо ввести целое положительное число'
    },
    [POSITIVE_DECIMAL]: {
        validation: (control: AbstractControl): ValidationErrors | null => {
            return Validators.pattern('[0-9]*[.,]?[0-9]+')(control) ? {[POSITIVE_DECIMAL]: true} : null;
        },
        message: 'Необходимо ввести дробное положительное число'
    },
    [REQUIRED]: {
        validation: Validators.required,
        message: 'Поле обязательно для заполнения'
    },
    [EMAIL]: {
        validation: Validators.email,
        message: 'Необходимо ввести правильный email'
    },
    // required_dynamic: {
    //     validation(controlType: AbstractControl, typeIds): ValidatorFn {
    //       return (control: AbstractControl): ValidationErrors | null => {
    //         for (const i of typeIds) {
    //           if (i == controlType.value) {
    //             return Validators.required(control) ? {'required_dynamic': true} : null;
    //           }
    //         }
    //
    //         return null;
    //       }
    //     },
    //     message: 'Поле обязательно для заполнения'
    // }
};
