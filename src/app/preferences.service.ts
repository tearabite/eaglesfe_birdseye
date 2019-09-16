import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class Preferences {
  robotAxes: boolean = false;
  fieldAxes: boolean = false;
}
@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  public preferencesSource = new BehaviorSubject(new Preferences());
  public preferences = this.preferencesSource.asObservable();

  constructor() {
  }

  public set(key: string, value: any) {
    let current = this.getAll();
    this.preferencesSource.next({ ...current, [key]: value})
  }

  public get(key: string) {
    const prefs = this.getAll();
    return prefs[key];
  }

  public getAll() {
    let current;
    this.preferences.subscribe(p => current = p);
    return current;
  }
}
