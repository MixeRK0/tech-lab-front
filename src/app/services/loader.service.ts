import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {
  private static _isLoaded = true;

  public isLoaded(): boolean {
    return LoaderService._isLoaded;
  }

  public startLoading() {
    LoaderService._isLoaded = false;
  }

  public stopLoading() {
    LoaderService._isLoaded = true;
  }

  constructor() { }
}
