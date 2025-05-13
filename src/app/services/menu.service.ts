import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuRefreshSource = new Subject<void>();
  menuRefresh$ = this.menuRefreshSource.asObservable();

  constructor() { }

  refreshMenu() {
    this.menuRefreshSource.next(); // Notify subscribers to refresh menu
  }
}
