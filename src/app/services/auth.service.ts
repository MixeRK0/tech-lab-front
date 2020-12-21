import { Injectable } from '@angular/core';

import {share} from 'rxjs/internal/operators';
import {DefaultService} from './prizma-server-security-api';
import {Observable} from 'rxjs';

export interface UserData {
  email: string,
  password: string
}

const CURRENT_USER_KEY = 'user';

@Injectable()
export class AuthService {
  static GetAuthorizedUser(): any | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);

    if (data) {
      return JSON.parse(data);
    }

    return null;
  }

  static SetAuthorizedUser(user: any) {
    console.log('User login. ' + user.email);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  constructor(private api: DefaultService) {
  }

  login(data: UserData, viaAd = false): Observable<any> {
    const obs = this.api.authLoginPost(data, viaAd).pipe(share());

    obs
      .subscribe(
      user => {
        if (user && user.access_token) {
          AuthService.SetAuthorizedUser(user);
        }

        return user;
      }
    );

    return obs;
  }

  logout(): Observable<any> {
    const obs = this.api.authLogoutPost().pipe(share());

    obs.subscribe(
      () => {
        console.log('User logout');
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    );

    return obs;
  }

  passwordResetRequest(data: any): Observable<any> {
    const obs = this.api.authRequestPasswordResetPost(data).pipe(share());
    return obs;
  }

  passwordReset(token: string, dataWithNewPassword: any): Observable<any> {
    const obs = this.api.authResetPasswordPost(token, dataWithNewPassword).pipe(share());
    return obs;
  }

  activateUser(token: string, dataWithNewPassword: any): Observable<any> {
    const obs = this.api.authActivateUserPost(token, dataWithNewPassword).pipe(share());
    return obs;
  }
}
