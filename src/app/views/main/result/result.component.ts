import {Component, Input} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {EditComponent} from '../edit/edit.component';
import {ResultDataUnit} from '@services/api/model/resultDataUnit';
import {Result, ResultService} from '@services/api';
import {of} from 'rxjs';
import {ResultDataStat} from '@services/api/model/resultDataStat';

@Component({
  selector: 'result-component',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  public findingWord = '';
  public findingSynt = 'double';
  public findingMorf = 'sysh';

  public isLoading = false;
  public currentResultId;

  @Input() public set resultId(id) {
    this.currentResultId = id;
    this.isLoading = true;
    this.resultsService.getResult(id, ['data', 'stat']).subscribe((result: Result) => {
      this.resultUnitsData = result.data;
      this.resultUnitsStat = result.stat;
      this.isLoading = false;
    });
  }
  public resultUnitsData: ResultDataUnit[] = [];
  public resultUnitsStat: ResultDataStat[] = [];

  public enableSyntOptions = of([
    {value: 'double', label: 'Сказуемым'},
    {value: 'underline', label: 'Подлежащим'},
    {value: 'obstoyt', label: 'Обстоятельством'},
    {value: 'dopol', label: 'Дополнением'},
    {value: 'opredel', label: 'Определением'},
    {value: 'not_set', label: 'Не имеет синтаксического смысла'},
    {value: 'undefined', label: 'Не определено'},
  ]);

  public enableMorfOptions = of([
    {value: 'sysh', label: 'Существительным'},
    {value: 'glag', label: 'Глаголом'},
    {value: 'nar', label: 'Наречием'},
    {value: 'soyz', label: 'Союзом'},
    {value: 'predlog', label: 'Предлогом'},
    {value: 'pril', label: 'Прилагательным'},
    {value: 'deepr', label: 'Деепричастием'},
    {value: 'prich', label: 'Причастием'},
    {value: 'chisl', label: 'Числительным'},
    {value: 'mest', label: 'Местоимением'},
    {value: 'undefined', label: 'Не определено'},
  ]);

  constructor(private modalService: BsModalService, private resultsService: ResultService) {}

  OpenEdit(resultUnitData) {
    this.modalService.show(EditComponent, {
      class: 'modal-lg modal-dialog',
      initialState: {
        resultUnitData: resultUnitData,
      }
    });
  }

  MorfLabelResolve(value) {
    switch (value) {
      case 'sysh':
        return 'СУЩ';
      case 'glag':
        return 'ГЛ';
      case 'nar':
        return 'Н';
      case 'soyz':
        return 'СОЮЗ';
      case 'predlog':
        return 'ПРЕДЛ';
      case 'pril':
        return 'ПРИЛ';
      case 'deepr':
        return 'ДЕЕПРИЧ';
      case 'prich':
        return 'ПРИЧ';
      case 'chisl':
        return 'ЧИСЛ';
      case 'mest':
        return 'МЕСТОИМ';
      default:
        return '';
    }
  }

  GetFilterResults() {
    this.isLoading = true;

    this.resultsService.getFilteredResult(this.currentResultId, this.findingWord, this.findingMorf, this.findingSynt).subscribe((res) => {
      this.resultUnitsData = res;
      this.isLoading = false;
    });
  }
}
