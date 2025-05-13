import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxCheckBoxModule,
  DxPopupModule,
  DxDataGridComponent,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { UserAddModule } from '../user-add/user-add.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showHeaderFilter: true;
  showFilterRow = true;
  isFilterOpened = false;
  GridSource: any;
  isLoading: boolean = false;
  filterRowVisible: boolean = false;
  userList: any;
  addUserPopupOpened: boolean = false;

  constructor() {}

  ngOnInit() {}

  addUser() {
    this.addUserPopupOpened = true;
  }

  handleClose() {
    this.addUserPopupOpened = false;
    // this.getPayrollList();
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxLookupModule,
    DxDataGridModule,
    DxButtonModule,
    FormPopupModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxPopupModule,
    UserAddModule,
  ],
  providers: [],
  exports: [UserListComponent],
  declarations: [UserListComponent],
})
export class UserListModule {}
