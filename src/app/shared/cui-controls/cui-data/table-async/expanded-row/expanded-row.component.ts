import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Input, Type,
  ViewChild
} from '@angular/core';
import {ExpandComponentDirective} from '../../../directives/expand-component/expand-component.directive';

@Component({
  selector: 'expanded-row',
  template: `<ng-template expandComponent></ng-template>`,
})

export class ExpandedRowComponent<TYPE> implements AfterViewInit {
  @ViewChild(ExpandComponentDirective) expandedView: ExpandComponentDirective;

  @Input() row: TYPE;

  @Input() config: {
    component: Type<any>,
    data: ((item: TYPE) => object)
  };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.InitExpandedRowView();
  }

  InitExpandedRowView() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.config.component);
    const viewContainerRef = this.expandedView.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);

    const data = this.config.data(this.row);
    for (const option of Object.keys(data)) {
        componentRef.instance[option] = data[option];
    }

    this.cdr.detectChanges();
  }
}
