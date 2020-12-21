import {Component, Input, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {NgModel} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CuiControlComponent} from '../../cui-control.component';
import {Coordinate} from '../../../cui-data';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

export interface CoordinateReferenceSystem {
    id?: number;
    name?: string;
    description?: string;
    code?: string;
    proj4?: string;
    created_at?: string;
    updated_at?: string;
}

@Component({
  selector: 'cui-ol-line-control',
  templateUrl: './cui-ol-line-control.component.html'
})
export class CuiOlLineControlComponent extends CuiControlComponent {
  @ViewChildren(NgModel) public inputs: QueryList<NgModel>;

  @Input() public CRS: CoordinateReferenceSystem;

  private modalRef: BsModalRef;

  constructor(private cuiModelHelperParent: CuiModelHelper,
              private modalService: BsModalService
  ) {
    super(cuiModelHelperParent);
  }

  OpenModalForEditLineOnMap(template: TemplateRef<any>) {
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
