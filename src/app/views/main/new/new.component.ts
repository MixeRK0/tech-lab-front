import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Result, ResultService} from '@services/api';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'new-component',
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit{
  public text;
  public confirmedText;
  public isLoading = false;
  public isShowResult = false;
  public currentResultId;

  CreateNewText() {
    this.isShowResult = false;
    this.isLoading = true;
    this.confirmedText = this.text;

    this.resultService.checkIsExist({text: this.confirmedText}).subscribe((res) => {
      window.confirm('В базе данных уже есть похожий проанализированный текст. Показать уже готовый результат?');
      if (res !== null) {
        window.confirm('В базе данных уже есть похожий проанализированный текст. Показать уже готовый результат?');
        const isShowExist = window.confirm('В базе данных уже есть похожий проанализированный текст. Показать уже готовый результат?');
        if (isShowExist) {
          this.resultService.getResult(res).subscribe((result: Result) => {
            this.currentResultId = result.id;
            this.isLoading = false;
            this.isShowResult = true;
          });
        } else {
          window.confirm('В базе данных уже есть похожий проанализированный текст. Показать уже готовый результат?');
          this.resultService.createResult({user_id: 1, input_text: this.confirmedText}).subscribe((result: Result) => {
            this.currentResultId = result.id;
            this.isLoading = false;
            this.isShowResult = true;
          });
        }
      } else {
        this.resultService.createResult({user_id: 1, input_text: this.confirmedText}).subscribe((result: Result) => {
          this.currentResultId = result.id;
          this.isLoading = false;
          this.isShowResult = true;
        });
      }
    })
  }

  constructor(public router: Router, private resultService: ResultService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const result = document.getElementById('result');
    const input = document.getElementById('file');

    input.addEventListener('change', function(e: HTMLInputEvent) {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        const files = e.target.files; // список файлов
        for (let i = 0; i < files.length; i ++) {
          const file = files[i];
          const type = file.type;
          readFile(file, function(text) {
            this.text = text;
          }.bind(this));
        }
      } else {
        alert('Ваш браузер не поддерживает FileAPI!');
      }
    }.bind(this), false);

    function readFile(file, callback) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(e) {
        const text = e.target.result;
        callback && callback(text);
      };
    }
  }
}
