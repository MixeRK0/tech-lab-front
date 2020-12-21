import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {Property} from '../index';
import {CuiModelHelper} from '../../services/cui/cui.helper';


export interface DataViewConfig<TYPE> {
  properties: Property<TYPE>[],
  spawnModel: (id) => Observable<TYPE>,
  updateFunction?: ((item: TYPE) => Observable<TYPE>),
  deleteFunction?: ((item: TYPE) => Observable<TYPE>),
  isDisableSave?: boolean,
  isDisableDelete?: boolean,
  isUseCustomUpdateFunction?: boolean,
  isUseCustomDeleteFunction?: boolean,
  customUpdateFunction?: ((item: TYPE) => Observable<TYPE>)
  customDeleteFunction?: ((item: TYPE) => Observable<TYPE>)
}

@Component({
  selector: 'cui-data-view',
  templateUrl: './cui-data-view.component.html',
  styleUrls: [
    '../../css/cui-data-view.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class CuiDataViewComponent<TYPE> implements OnChanges {
  @Input() public modelId: any;
  @Input() public config: DataViewConfig<TYPE>;

  public model: TYPE;

  public get isEditable() {
    return this.config.updateFunction !== undefined || this.config.customUpdateFunction !== undefined;
  };

  public get isAvailableDelete() {
    return !this.config.isDisableDelete
      && (this.config.deleteFunction !== undefined || this.config.customDeleteFunction !== undefined);
  };

  constructor(public cuiModelHelper: CuiModelHelper) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.model = null;
    this.config
      .spawnModel(this.modelId)
      .subscribe(model => {
        this.model = model;
      })
  }

  SaveModel(item: TYPE) {
    if (this.config.isUseCustomUpdateFunction) {
      this.config.customUpdateFunction(item);
    } else {
      this.config.updateFunction(item).subscribe(
        result => {
          console.log('Success', result);
        },
        error => console.error('Error', error)
      )
    }
  }

  DeleteModel(item: TYPE) {
    if (this.config.isUseCustomDeleteFunction) {
      this.config.customDeleteFunction(item);
    } else {
      this.config.deleteFunction(item).subscribe();
    }
  }
}
