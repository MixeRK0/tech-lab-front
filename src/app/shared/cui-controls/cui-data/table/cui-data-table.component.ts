import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {Button, Property} from '../index';
import {Router} from '@angular/router';
import {CuiFormHelper} from '../../services/cui/cui-form.helper';
import {CuiModelHelper} from '../../services/cui/cui.helper';

export interface DataTableConfig<TYPE> {
  title?: string,
  additionalData?: () => {label: string, value: any}[],
  titleLevel?: 1 | 2 | 3 | 4,
  properties: Property<TYPE>[],
  buttons: Button<TYPE>[],
  filterCallback?: ((item: TYPE) => boolean),
  saveFunction?: ((item: TYPE) => Observable<TYPE>),
  newItem?: (() => Observable<TYPE>),
  addUrl?: any[],
  complexUpdateFunction?: ((item: TYPE[]) => Observable<TYPE[]>),
}

@Component({
  selector: 'cui-data-table',
  templateUrl: './cui-data-table.component.html',
  styleUrls: [
    '../../css/cui-data-table.component.css'
  ]
})
export class CuiDataTableComponent<TYPE> implements OnChanges {
  @Input() public list: TYPE[];

  @Input() public config: DataTableConfig<TYPE>;

  public additionalPropsList: {is_new: boolean, is_saved: boolean}[];

  constructor(private cuiFormHelper: CuiFormHelper,
              public cuiModelHelper: CuiModelHelper,
              private router: Router) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.additionalPropsList = this.CreateAdditionalPropsList(this.list);
  }

  SaveAllModels() {
    const observableUpdate = this.config.complexUpdateFunction(this.list);

    observableUpdate.subscribe(
      result => {
        this.list = result;
        this.additionalPropsList = this.CreateAdditionalPropsList(result);
        console.log('Success', result);
      },
      error => console.error('Error', error)
    )
  }

  SaveModel(item: TYPE) {
    const index = this.list.indexOf(item);

    const observableUpdate = this.config.saveFunction(item);

    observableUpdate.subscribe(
      updatedItem => {
        this.list[index] = updatedItem;
        this.additionalPropsList[index].is_saved = true;
        this.additionalPropsList[index].is_new = false;
        console.log('Success', updatedItem);
      },
      error => console.error('Error', error)
    )
  }

  AddItem() {
    if (this.config.addUrl) {
      this.router.navigate(this.config.addUrl);

      return;
    }

    this.config.newItem().subscribe(
      newItem => {
        this.PushToTable(newItem, true, false);
      }
    );
  }

  PushToTable(item: TYPE, isNew, isSaved) {
    this.list.push(item);
    this.additionalPropsList.push({is_new: isNew, is_saved: isSaved});
  }

  FilterList(list: TYPE[]) {
    if (this.config.filterCallback) {
      return list.filter(this.config.filterCallback);
    }

    return list;
  }

  IsAvailableAdd(): boolean {
    return this.config.newItem !== undefined || this.config.addUrl !== undefined;
  }

  IsAvailableSave(): boolean {
    return this.config.saveFunction !== undefined;
  }

  IsAvailableComplexUpdate(): boolean {
    return this.config.complexUpdateFunction !== undefined;
  }

  ResolveClasses(itemIndex: number) {
    return {
      'animated fadeIn': true,
      'table-secondary': this.additionalPropsList[itemIndex].is_new,
      'table-info': this.additionalPropsList[itemIndex].is_saved === false && !this.additionalPropsList[itemIndex].is_new
    }
  }

  MarkAsChanged(itemIndex) {
    this.additionalPropsList[itemIndex].is_saved = false;
  }

  private CreateAdditionalPropsList(list: TYPE[]) {
    const addList = [];
    for (let i = 0; i < list.length; i++) {
      addList.push({is_new: false, is_saved: true});
    }

    return addList;
  }
}
