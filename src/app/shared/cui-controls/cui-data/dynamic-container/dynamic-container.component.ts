import {Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';

export abstract class ComponentForDynamicInsert {
  abstract SetData?(data: any);
}

@Component({
  selector: 'dynamic-container',
  template: '<ng-template #dynamic></ng-template>',
})
export class DynamicContainerComponent implements OnInit {
  @Input() data: any;

  @Input() componentClass: Type<ComponentForDynamicInsert>;

  @ViewChild('dynamic', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

  constructor(private factoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.addDynamicComponent()
  }

  private addDynamicComponent() {
    const factory = this.factoryResolver.resolveComponentFactory(this.componentClass);
    const component = this.viewContainerRef.createComponent(factory);
    this.setParamsInComponent(component);
  }

  private setParamsInComponent(component) {
    if (this.data) {
      (<ComponentForDynamicInsert>(component.instance)).SetData(this.data);
    }
  }
}
