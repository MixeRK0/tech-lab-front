import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './app-preloader.component.html'
})
export class AppPreloaderComponent {
  @Input() public isLoading: boolean;
}
