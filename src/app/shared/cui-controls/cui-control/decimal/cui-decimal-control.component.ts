import {Component} from '@angular/core';
import {CuiControlComponent} from '../cui-control.component';
import * as ASCII from '../../services/cui/ascci.helper';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
  selector: 'cui-decimal-control',
  templateUrl: './cui-decimal-control.component.html',
})
export class CuiDecimalControlComponent extends CuiControlComponent {
  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }

  transform(value: string): string {
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
      result = '0' + result
    }

    return result;
  }

  EmitValueChanged(value: any) {
    const transformedValue = this.transform(value);
    if (transformedValue !== value) {
      this.input.control.setValue(transformedValue);
    } else {
      super.EmitValueChanged(value);
    }
  }
}
