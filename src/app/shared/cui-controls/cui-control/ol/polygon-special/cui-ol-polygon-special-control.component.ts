import {Component, Input, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {NgModel} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CuiControlComponent} from '../../cui-control.component';
import {CoordinateReferenceSystem} from '@shared/cui-controls/cui-control/ol/line/cui-ol-line-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';
import {DynamicContainerComponent} from '@shared/cui-controls/cui-data/dynamic-container/dynamic-container.component';

@Component({
  selector: 'cui-ol-polygon-special-control',
  templateUrl: './cui-ol-polygon-special-control.component.html'
})
export class CuiOlPolygonSpecialControlComponent extends CuiControlComponent {
  @ViewChildren(NgModel)
  public inputs: QueryList<NgModel>;

  @Input()
  public CRS: CoordinateReferenceSystem;

  @Input()
  public olSpecialData: any;

  @Input()
  public modalComponent: DynamicContainerComponent;

  public modalRef: BsModalRef;

  constructor(private cuiModelHelperParent: CuiModelHelper,
              private modalService: BsModalService
  ) {
    super(cuiModelHelperParent);
  }

  OpenModalForEditPolygonOnMap(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg modal-dialog'});
  }

  GetCountPoints(): number {
    const coordinates = this.value;

    let count = 0;
    for (const lineRing of coordinates || []) {
      count += lineRing.length;
    }

    return count;
  }
}
