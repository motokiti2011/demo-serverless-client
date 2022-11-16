import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { user } from '../entity/user';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {

  private _user$

  constructor() {
    this._user$ = new BehaviorSubject<user | null>(null)
  }

  get user$() {
    return this._user$.asObservable()
  }

  login(user: user) {
    this._user$.next(user)
  }

  logout() {
    this._user$.next(null)
  }
}
