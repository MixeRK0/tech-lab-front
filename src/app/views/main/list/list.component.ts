import {Component} from '@angular/core';
import {Result, ResultService} from '@services/api';
import {MapResponseToListAndSummaryData, Property} from '@shared/cui-controls/cui-data';
import {map} from 'rxjs/operators';
import {ResultComponent} from '../result/result.component';
import {Router} from '@angular/router';

@Component({
  selector: 'list-component',
  templateUrl: './list.component.html',
})
export class ListComponent {
  public dataTableConfig = {
    title: 'Готовые результаты',
    enableAutoSave: true,
    properties: <Property<Result>[]> [
      {
        is_editable: false,
        value: (item) => item.id,
        label: 'ID',
      },
      {
        is_editable: false,
        value: (item) => item.user_id,
        label: 'ID пользователя',
      },
      {
        is_editable: false,
        value: (item) => item.input_text.length > 50 ? item.input_text.substr(0, 50) + '...' : item.input_text,
        label: 'Текст',
      }
    ],
    deleteFunction: (item) => {
      return this.resultsService.deleteResult(item.id);
    },
    spawnData: (searchString?: string, page?: number, pageSize?: number) => {
      return this.resultsService
        .listResults(['input_text', 'data'], 'response')
        .pipe(
          map(MapResponseToListAndSummaryData)
        );
    },
    expandView: {
      component: ResultComponent,
      data: (item) => {
        return {
          resultId: item.id,
        };
      },
    },
  };

  constructor(public router: Router, private resultsService: ResultService) {}
}
