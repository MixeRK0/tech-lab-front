import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AbstractControl, FormGroup} from '@angular/forms';

import {mergeMap} from 'rxjs/internal/operators';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';
import {TypeaheadMatch} from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'cui-typeahead-control',
  templateUrl: './cui-typeahead-control.component.html'
})
export class CuiTypeaheadControlComponent implements OnInit {
  @Input() public form: FormGroup;

  @Input() public key: string;

  @Input() public model: object;

  @Input() public itemKey: string;

  @Input() public searchKey: string;

  @Input() private dataSource: (searchString: string) => Observable<object[]>;

  @Input() private initSearchValue: string;

  @Input() private onSelect: (itemFromSearch: any, item: any) => void;

  @Output() private changedByUser = new EventEmitter<any>();

  public asyncSelected: string;
  public typeaheadLoading: boolean;
  public typeaheadNoResults: boolean;
  public items: Observable<any>;

  constructor(public cuiHelper: CuiModelHelper) {}

  get control(): AbstractControl {
    return this.form.get(this.key);
  }

  ngOnInit(): void {
    this.asyncSelected = this.initSearchValue;

    this.items = Observable.create((observer: any) => {
      observer.next(this.asyncSelected);
    }).pipe(
      mergeMap((searchString: string) => this.dataSource(searchString))
    );
  }

  Select(e: TypeaheadMatch) {
    this.changedByUser.emit(e.item[this.itemKey]);

    if (this.onSelect) {
      this.onSelect(e.item, this.model);
    }
  }

  SetNoResult(value: boolean) {
    this.typeaheadNoResults = value;
  }

  SetLoading(value: boolean) {
    this.typeaheadLoading = value;

    if (this.typeaheadLoading) {
      this.SetNoResult(false);
    }
  }
}
