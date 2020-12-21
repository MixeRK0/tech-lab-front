import {Component, Input} from '@angular/core';
import {ReadOnlyProperty} from '../index';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'cui-data-read-only-cell',
  templateUrl: './cui-data-read-only-cell.component.html',
})
export class CuiDataReadOnlyCellComponent<TYPE> {
  @Input() public property: ReadOnlyProperty<TYPE>;
  @Input() public model: TYPE;
  @Input() public inComplex: boolean;
  @Input() public inComplexTable: boolean;
  @Input() public labelCol;
  @Input() public inputCol;
  @Input() public label;

  constructor(private sanitizer: DomSanitizer) {}

  public ResolveControlClass(): string {
    if (this.inComplex && !this.inComplexTable) {
      return 'input-group col-' + this.inputCol;
    } else {
      return ''
    }
  }

  public ResolveLabelClass(): string {
    if (this.inComplex && !this.inComplexTable) {
      return 'col-' + this.labelCol
    } else {
      return ''
    }
  }

  public ResolveGroupClass(): string {
    if (this.inComplex && !this.inComplexTable) {
      return 'row pb-1'
    } else {
      return ''
    }
  }

  // @todo: Сделать рабочий санитайзер
  SanitizeHtml(html: string) {
    // return this.sanitizer.bypassSecurityTrustHtml(html);
    return html;
  }
}
