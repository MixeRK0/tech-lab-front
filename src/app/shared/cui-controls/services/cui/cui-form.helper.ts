import {Injectable} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';

@Injectable()
export class CuiFormHelper {

  constructor(private formBuilder: FormBuilder) {}

  public CreateFormGroup(formConfig: {[p: string]: any}): FormGroup {
    for (const key in formConfig) {
      if (key in formConfig) {
        // if (Object.prototype.toString.call(formConfig[key]) === '[object Object]') {
        //   formConfig[key] = this.CreateFormGroupOrControl(formConfig[key]);
        // }
      }
    }

    return this.formBuilder.group(formConfig);
  }

  private CreateFormGroupOrControl(formConfig: {[p: string]: any}): AbstractControl {
    // const type = Object.prototype.toString.call(formConfig);

    // if (type === '[object Object]') {
    //   for (const key in formConfig) {
    //     if (key in formConfig) {
    //       if (Object.prototype.toString.call(formConfig[key]) === '[object Object]') {
    //         formConfig[key] = this.CreateFormGroupOrControl(formConfig[key]);
    //       }
    //     }
    //   }

      return this.formBuilder.group(formConfig)
    // } else if (type === '[object Array]') {
    //   return this.formBuilder.control(formConfig[0], formConfig[1]);
    // } else {
    //   return this.formBuilder.control(formConfig);
    // }
  }
}
