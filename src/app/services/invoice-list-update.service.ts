import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceListUpdateService {
private updateSubject = new Subject<void>();
update$ = this.updateSubject.asObservable();
  constructor() { }

    triggerUpdate() {
    this.updateSubject.next();
  }
}
