import {
  ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Type,
  ViewEncapsulation
} from '@angular/core';
import {Observable} from 'rxjs';
import {Button, DataTable, EditableProperty, Property, UnderTableButton} from '../index';
import {Router} from '@angular/router';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {CuiFormHelper} from "../../services/cui/cui-form.helper";
import {CuiModelHelper} from "../../services/cui/cui.helper";

export function MapResponseToListAndSummaryData(response: HttpResponse<any>): ListAndSummaryData<any> {
  const headers: HttpHeaders = response.headers;

  return <ListAndSummaryData<any>>{
    list: response.body,
    summary: {
      pagination: {
        curPage: parseInt(headers.get('X-Pagination-Current-Page'), 10),
        pageSize: parseInt(headers.get('X-Pagination-Per-Page'), 10),
        pageCount: parseInt(headers.get('X-Pagination-Page-Count'), 10),
      },
      totalCount: parseInt(headers.get('X-Pagination-Total-Count'), 10)
    }
  };
}

export function MapGetItemResponseToListAndSummaryData(response: HttpResponse<any>): ListAndSummaryData<any> {
  return <ListAndSummaryData<any>>{
    list: [response.body],
    summary: {
      pagination: {
        curPage: 1,
        pageSize: 1,
        pageCount: 1,
      },
      totalCount: 1
    }
  };
}

export interface Pagination {
  curPage: number,
  pageSize: number,
  pageCount?: number,
}

export interface SummaryData {
  pagination: Pagination,
  totalCount: number
}

export interface ListAndSummaryData<TYPE> {
  list: TYPE[],
  summary: SummaryData
}

export type LevelType = 1 | 2 | 3 | 4;

export interface DataTableConfig<TYPE> {
  title?: string,
  additionalData?: () => { label: string, value: any }[],
  titleLevel?: LevelType,
  properties: Property<TYPE>[],
  buttons?: Button<TYPE>[],
  underTableButtons?: UnderTableButton[],
  form?: (item: TYPE) => { [key: string]: any },
  filterCallback?: ((item: TYPE) => boolean),
  saveFunction?: (item: TYPE) => Observable<TYPE>,
  deleteFunction?: (item: TYPE) => Observable<any>,
  newItem?: () => Observable<TYPE>,
  copyFunction?: (item: TYPE) => Observable<any>,
  addUrl?: any[],
  enableAutoSave?: boolean,
  isResponsive?: boolean,
  isAutoUpdate?: boolean,

  complexUpdateFunction?: (item: TYPE[]) => Observable<ListAndSummaryData<TYPE>>,
  complexUpdateFunctionLabel?: string,
  enableSearch?: boolean,
  searchHint?: string,
  spawnData?: (searchString?: string, page?: number, pageSize?: number, sort?: Array<string>) => Observable<ListAndSummaryData<TYPE>>,
  expandView?: {
    component: Type<any>,
    data: ((item: TYPE) => object)
    isDisabledForRow?: ((item: TYPE) => boolean)
  };
  enableSummaryInfo?: boolean,
  isDisableRefresh?: boolean,
  isEnableSort?: boolean,
  saveAfterAddNew?: boolean,
  isDisableAdding?: boolean,
  isDisableDeleting?: boolean
}

const CLOSED = 'closed';
const EXPANDED = 'expanded';

const SORT_BUTTON_CLASS_DESC = 'sorting_desc';
const SORT_BUTTON_CLASS_ASC = 'sorting_asc';
const SORT_BUTTON_CLASS_NOT_SORTED = 'sorting';

@Component({
  selector: 'cui-data-table-async',
  templateUrl: './cui-data-table-async.component.html',
  styleUrls: [
    '../../css/cui-data-table-async.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CuiDataTableAsyncComponent<TYPE> implements DataTable<TYPE>, OnChanges, OnInit, OnDestroy {
  @Input() public config: DataTableConfig<TYPE>;
  @Input() public list: TYPE[] = [];

  private PAGE_SIZE = 20;

  private sortArray = [];

  private sortButtonClass = [];

  public searchString: string;
  public isLoadingRows: boolean;
  public autoUpdateProcess;
  private itemProperties: {
    is_new: boolean,
    is_saved: boolean,
    is_error: boolean,
    is_save_in_progress: boolean,
    is_save_in_queue: boolean
  }[] = [];
  private expandedRows: string[] = new Array(this.PAGE_SIZE).fill(CLOSED);
  public summaryData: SummaryData = {
    totalCount: 0,
    pagination: {
      curPage: 1,
      pageSize: this.PAGE_SIZE
    }
  };

  constructor(private cuiFormHelper: CuiFormHelper,
              public cuiModelHelper: CuiModelHelper,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  public SetList(newList: TYPE[]) {
    this.list = newList;
  }

  ngOnInit(): void {
    this.SetPageAndUpdate(1);

    if (this.config.isAutoUpdate) {
      this.InitAutoUpdateProcess();
    }
  }

  InitAutoUpdateProcess() {
    this.autoUpdateProcess = setInterval(function () {
      this.UpdateDataOnPage(true);
    }.bind(this), 5000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.SetPageAndUpdate(1);
  }

  HandleResult(result: ListAndSummaryData<TYPE>) {
    this.ValidateSummaryData(result.summary);
    this.SetList(result.list);
    this.UpdateSummaryData(result.summary);
    this.ResetItemProperties(this.list);
  }

  UpdateSummaryData(data: SummaryData) {
    const oldPage = this.summaryData.pagination.curPage;

    this.summaryData = data;

    this.ReinitializeExpandRows(
      Math.min(this.summaryData.pagination.pageSize, this.summaryData.totalCount),
      oldPage !== data.pagination.curPage
    );
  }

  private ReinitializeExpandRows(newLength: number, isNeedReset: boolean) {
    if (isNeedReset) {
      this.expandedRows = new Array(newLength).fill(CLOSED);

      return;
    }

    if (this.expandedRows.length === newLength) {
      return;
    }

    if (this.expandedRows.length > newLength) {
      this.expandedRows.splice(newLength);
    } else {
      this.expandedRows = this.expandedRows.concat(new Array(newLength - this.expandedRows.length).fill(CLOSED));
    }
  }

  SetPageAndUpdate(page: number) {
    this.summaryData.pagination.curPage = page;

    this.UpdateDataOnPage();
  }

  UpdateDataOnPage(isAuto: boolean = false) {
    if (!this.config) {
      console.warn('Для обновления таблицы необходимо указать настройки таблицы');

      return;
    }

    if (!this.IsAsync()) {
      console.warn('Для обновления таблицы необходимо указать "spawnData" в настройках');

      return;
    }

    if (isAuto === false) {
      this.isLoadingRows = true;
    }
    this.changeDetectorRef.detectChanges();
    const dataObservable = this.config.spawnData(
      this.searchString,
      this.summaryData.pagination.curPage,
      this.summaryData.pagination.pageSize,
      this.sortArray
    );

    dataObservable.subscribe(result => {
      this.HandleResult(result);
      if (isAuto === false) {
        this.isLoadingRows = false;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  SaveAllModels() {
    const observableUpdate = this.config.complexUpdateFunction(this.list);

    observableUpdate.subscribe(
      result => this.HandleResult(result),
      error => console.error('Error', error)
    );
  }

  SaveItem(index: number) {
    if (this.itemProperties[index].is_save_in_progress) {
      this.itemProperties[index].is_save_in_queue = true;

      return;
    }

    this.itemProperties[index].is_save_in_progress = true;
    this.itemProperties[index].is_save_in_queue = false;

    this.config.saveFunction(this.list[index]).subscribe(
      updatedItem => {
        this.RefreshFieldsInItem(this.list[index], updatedItem);

        this.itemProperties[index].is_saved = true;
        this.itemProperties[index].is_new = false;
        this.itemProperties[index].is_error = false;

        this.changeDetectorRef.detectChanges();

        this.itemProperties[index].is_save_in_progress = false;
        if (this.itemProperties[index].is_save_in_queue) {
          this.SaveItem(index);
        }
      },
      error => {
        if (this.itemProperties[index].is_new === false) {
          this.itemProperties[index].is_error = true;
        }
        this.itemProperties[index].is_save_in_progress = false;

        console.error('Error', error);
      }
    );
  }

  DeleteItem(item: TYPE) {
    if (confirm('Вы уверены, что хотите удалить строку?') === false) {
      return;
    }

    const index = this.list.indexOf(item);

    if (this.itemProperties[index].is_new) {
      this.list.splice(index, 1);
      this.itemProperties.splice(index, 1);
      this.changeDetectorRef.detectChanges();
    } else {
      const observableDelete = this.config.deleteFunction(item);

      observableDelete.subscribe(
        () => {
          this.list.splice(index, 1);
          this.itemProperties.splice(index, 1);
          this.changeDetectorRef.detectChanges();
        },
        error => console.error('Error', error)
      );
    }
  }

  AddItem() {
    if (this.config.addUrl) {
      return this.router.navigate(this.config.addUrl);
    }

    this.config.newItem().subscribe(
      newItem => {
        this.list.push(newItem);
        this.itemProperties.push({
          is_new: true,
          is_saved: false,
          is_error: false,
          is_save_in_progress: false,
          is_save_in_queue: false
        });

        if (this.IsAvailableViewExpand()) {
          this.expandedRows.push(CLOSED);
        }

        if (this.config.saveAfterAddNew) {
          this.SaveItem(this.list.length - 1);
        }

        this.changeDetectorRef.detectChanges();
      }
    );
  }

  CopyItem(index: number) {
    this.config.copyFunction(this.list[index]).subscribe(
      copy => {
        this.list.splice(index + 1, 0, copy);
        this.itemProperties.splice(index + 1, 0, {
          is_new: false,
          is_saved: true,
          is_error: false,
          is_save_in_progress: false,
          is_save_in_queue: false
        });
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  IsAvailableAdd(): boolean {
    return !this.config.isDisableAdding && (this.config.newItem !== undefined || this.config.addUrl !== undefined);
  }

  IsAvailableSave(): boolean {
    return this.config.saveFunction !== undefined;
  }

  IsAvailableAutoSave(): boolean {
    return this.config.enableAutoSave === true;
  }

  IsAvailableDelete(): boolean {
    return !this.config.isDisableDeleting && this.config.deleteFunction !== undefined;
  }

  IsAvailableComplexUpdate(): boolean {
    return this.config.complexUpdateFunction !== undefined;
  }

  IsAvailableViewExpand(): boolean {
    return this.config.expandView !== undefined;
  }

  IsAvailableCopy(): boolean {
    return this.config.copyFunction !== undefined;
  }

  IsAsync(): boolean {
    return this.config.spawnData !== undefined;
  }

  ResolveClasses(itemIndex: number) {
    return {
      'border': true,
      'new-item table-secondary':
        this.itemProperties[itemIndex]
        && this.itemProperties[itemIndex].is_new,
      'not-saved-item table-info':
        this.itemProperties[itemIndex]
        && this.itemProperties[itemIndex].is_saved === false
        && !this.itemProperties[itemIndex].is_new
        && !this.itemProperties[itemIndex].is_error,
      'error-item table-danger':
        this.itemProperties[itemIndex]
        && this.itemProperties[itemIndex].is_error === true
    };
  }

  MarkAsChanged(itemIndex) {
    this.itemProperties[itemIndex].is_saved = false;
    this.changeDetectorRef.detectChanges();
  }

  OnUserChangeFunction(itemIndex, property: EditableProperty<TYPE>, value) {
    this.cuiModelHelper.SetModelValue(<Object>this.list[itemIndex], property.key, value);
    if (this.IsAvailableAutoSave()) {
      this.SaveItem(itemIndex)
    } else {
      this.MarkAsChanged(itemIndex)
    }
  }

  private ResetItemProperties(list: TYPE[]) {
    this.itemProperties = [];
    for (let i = 0; i < list.length; i++) {
      this.itemProperties.push({
        is_new: false,
        is_saved: true,
        is_error: false,
        is_save_in_progress: false,
        is_save_in_queue: false
      });
    }
    this.changeDetectorRef.detectChanges();
  }

  IsNeedDrawButtonColumns() {
    return this.config.buttons
      && this.config.buttons.length > 0
      || this.IsAvailableSave()
      || this.IsAvailableDelete()
      || this.IsAvailableViewExpand();
  }

  CountButtons(): number {
    return (this.config.buttons ? this.config.buttons.length : 0) +
      (this.IsAvailableSave() ? 1 : 0) +
      (this.IsAvailableDelete() ? 1 : 0) +
      (this.IsAvailableViewExpand() ? 1 : 0) +
      (this.IsAvailableCopy() ? 1 : 0);
  }

  ResolveUnitPostfix(property: Property<TYPE>) {
    if (!property.inputConfig || !property.inputConfig.unitName) {
      return '';
    }

    return ' (' + property.inputConfig.unitName + ')';
  }

  FilterUnitName(property: EditableProperty<TYPE>) {
    if (property.inputConfig && property.inputConfig.unitName) {
      const newProperty = JSON.parse(JSON.stringify(property));

      newProperty.inputConfig.unitName = undefined;

      return newProperty;
    }

    return property;
  }

  ExpandRow(index: number) {
    this.expandedRows[index] = EXPANDED;
    this.changeDetectorRef.detectChanges();
  }

  CloseRow(index: number) {
    this.expandedRows[index] = CLOSED;
    this.changeDetectorRef.detectChanges();
  }

  IsNeedDrawExpandBlockForRow(index: number): boolean {
    if (this.IsAvailableViewExpand() === false) {
      return false;
    }

    return this.expandedRows[index] === EXPANDED;
  }

  IsNeedShowPagination(): boolean {
    return this.summaryData.pagination.pageCount > 1;
  }

  IsClosedRow(index): boolean {
    return this.expandedRows[index] === CLOSED;
  }

  IsExpandedRow(index): boolean {
    return this.expandedRows[index] === EXPANDED;
  }

  IsDisabledExpandForRow(item: TYPE): boolean {
    return this.config.expandView.isDisabledForRow && this.config.expandView.isDisabledForRow(item);
  }

  private ValidateSummaryData(summary: SummaryData) {
    if (!summary.totalCount && summary.totalCount !== 0) {
      throw new Error('Total count is required in summary data');
    }

    if (!summary.pagination) {
      throw new Error('Pagination is required in summary data');
    }

    if (!summary.pagination.curPage && summary.pagination.curPage !== 0) {
      throw new Error('Current page is required in pagination of summary data');
    }

    if (!summary.pagination.pageCount && summary.pagination.pageCount !== 0) {
      throw new Error('Page count page is required in pagination of summary data');
    }
  }

  public SortTable(nameOfColumn, indexOfColumn) {
    const newSortButtonClass = this.UpdateSortArrayAndResolveSortButtonClass(nameOfColumn);
    this.UpdateSortButtonClasses(indexOfColumn, newSortButtonClass);
    this.UpdateDataOnPage();
  }

  private UpdateSortArrayAndResolveSortButtonClass(nameOfColumn) {
    const descSort = '-' + nameOfColumn;
    const ascSort = nameOfColumn;
    let isNeedToAddNewSort = true;
    let index = 0;

    for (const sortValue of this.sortArray) {
      if (sortValue === descSort) {
        this.sortArray[index] = ascSort;
        isNeedToAddNewSort = false;

        return SORT_BUTTON_CLASS_ASC;
      } else if (sortValue === ascSort) {
        this.sortArray.splice(index, 1);
        isNeedToAddNewSort = false;

        return SORT_BUTTON_CLASS_NOT_SORTED;
      }

      index++;
    }

    if (isNeedToAddNewSort) {
      this.sortArray.push(descSort);

      return SORT_BUTTON_CLASS_DESC;
    }
  }

  private UpdateSortButtonClasses(index, newClass) {
    this.sortButtonClass[index] = newClass;
  }

  public ClearSortData() {
    this.sortButtonClass = [];
    this.sortArray = [];
    this.UpdateDataOnPage();
  }

  public ResolveTableHeaderColumnClass(isEnableSort, indexOfColumn) {
    if (isEnableSort) {
      return this.sortButtonClass[indexOfColumn] ? 'p-2 border ' + this.sortButtonClass[indexOfColumn] : 'p-2 border sorting';
    } else {
      return 'p-2 border'
    }
  }

  public ResolveTableHeaderColumnClick(property: Property<TYPE>, indexOfColumn) {
    if (property.enableSort) {
      return this.SortTable(property.key, indexOfColumn)
    }
  }

  public RefreshFieldsInItem(item, updatedItem) {
    for (const field in updatedItem) {
      item[field] = updatedItem[field];
    }
  }

  public ngOnDestroy(): void {
    if (this.autoUpdateProcess) {
      clearInterval(this.autoUpdateProcess)
    }
  }
}
