import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[expandComponent]',
})

export class ExpandComponentDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
