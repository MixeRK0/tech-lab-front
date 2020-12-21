import {Component, Input, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {NgModel} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CuiControlComponent} from '../../cui-control.component';
import {Coordinate} from '../../../cui-data';
import {CoordinateReferenceSystem} from '@shared/cui-controls/cui-control/ol/line/cui-ol-line-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

@Component({
  selector: 'cui-ol-rectangle-control',
  templateUrl: './cui-ol-rectangle-control.component.html'
})
export class CuiOlRectangleControlComponent extends CuiControlComponent {
  @ViewChildren(NgModel) public inputs: QueryList<NgModel>;

  @Input() public CRS: CoordinateReferenceSystem;
  @Input() public viewCenter: [number, number];

  private modalRef: BsModalRef;

  constructor(private cuiModelHelperParent: CuiModelHelper,
              private modalService: BsModalService
  ) {
    super(cuiModelHelperParent);
  }

  OpenModalForEditPolygonOnMap(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg modal-dialog'});
  }

  ChangeValue(data: Coordinate[]) {
    this.changedByUser.emit(data);
    this.HideModal();
  }

  HideModal() {
    this.modalRef.hide();
  }
}
