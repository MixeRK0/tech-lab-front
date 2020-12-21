import {Component, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {ResultDataUnit} from '@services/api/model/resultDataUnit';
import {ResultUnitDataService} from '@services/api/api/resultUnitData.service';

@Component({
  selector: 'edit-component',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  public resultUnitData: ResultDataUnit;
  public resultUnitDataClone: ResultDataUnit;

  public enableSyntOptions = of([
    {value: 'double', label: 'Сказуемое'},
    {value: 'underline', label: 'Подлежащее'},
    {value: 'obstoyt', label: 'Обстоятельство'},
    {value: 'dopol', label: 'Дополнение'},
    {value: 'opredel', label: 'Определение'},
  ]);

  public enableMorfOptions = of([
    {value: 'sysh', label: 'Существительное'},
    {value: 'glag', label: 'Глагол'},
    {value: 'nar', label: 'Наречие'},
    {value: 'soyz', label: 'Союз'},
    {value: 'predlog', label: 'Предлог'},
    {value: 'pril', label: 'Прилагательное'},
  ]);

  ngOnInit(): void {
    this.resultUnitDataClone = Object.assign({}, this.resultUnitData);
  }

  constructor(private resultUnitsService: ResultUnitDataService) {}

  UpdateData() {
    this.resultUnitData.synt = this.resultUnitDataClone.synt;
    this.resultUnitData.morf = this.resultUnitDataClone.morf;
    this.resultUnitsService.updateResultUnits(this.resultUnitData.id, this.resultUnitData).subscribe(() => {});
  }
}
