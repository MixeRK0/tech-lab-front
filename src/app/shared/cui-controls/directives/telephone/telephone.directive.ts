import {Directive, ElementRef, HostListener} from '@angular/core';
import * as ASCII from '../../services/cui/ascci.helper';

const MAX_COUNT_OF_DIGIT = 20;

@Directive({
  selector: '[telephone]'
})
export class TelephoneDirective {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef
  ) {
    this.el = this.elementRef.nativeElement;
  }

  transform(value: string): string {
    let result = '+';
    let countOfDigit = 0;
    for (const currentChar of value) {
      const currentCharCode = currentChar.charCodeAt(0);

      if (ASCII.isDigit(currentCharCode)) {
        if (countOfDigit <= MAX_COUNT_OF_DIGIT) {
          result += currentChar;
          countOfDigit++;
        }
      } else if (this.IsDelimiter(currentCharCode)) {
        result += currentChar;
      }
    }

    return result;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value) {
    this.el.value = this.transform(value);
  }

  private IsDelimiter(currentChar: number) {
    return currentChar === ASCII.CHAR_ROUND_BRACKET_OPEN
      || currentChar === ASCII.CHAR_ROUND_BRACKET_CLOSE
      || currentChar === ASCII.CHAR_MINUS
      || currentChar === ASCII.CHAR_POINT
  }
}
