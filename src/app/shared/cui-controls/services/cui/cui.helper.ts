import {Injectable} from '@angular/core';

@Injectable()
export class CuiModelHelper {
  public GetModelValue(model: object, key: string): any {
    const keyParts = key.split('.');

    if (keyParts.length === 1) {
      if (!model) {
        model = {};
      }

      return model[key];
    } else {
      return this.RecursiveGetModelValue(model, keyParts);
    }
  }

  public SetModelValue(model: object, key: string, value: any) {
    const keyParts = key.split('.');

    if (keyParts.length === 1) {
      if (!model) {
        model = {};
      }

      model[key] = value;
    } else {
      this.RecursiveSetModelValue(model, keyParts, value);
    }
  }

  private RecursiveGetModelValue(model: object, keyParts: string[]) {
    if (!model) {
      model = {};
    }

    if (keyParts.length === 1) {
      return model[keyParts[0]];
    } else {
      if (!(keyParts[0] in model)) {
        model[keyParts[0]] = {};
      }
      return this.RecursiveGetModelValue(model[keyParts[0]], keyParts.slice(1));
    }
  }

  private RecursiveSetModelValue(model: object, keyParts: string[], value: string) {
    if (keyParts.length === 1) {
      model[keyParts[0]] = value;
    } else {
      if (!model[keyParts[0]]) {
        model[keyParts[0]] = {};
      }

      this.RecursiveSetModelValue(model[keyParts[0]], keyParts.slice(1), value);
    }
  }
}
