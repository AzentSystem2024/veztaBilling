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
import {
  UserListComponent,
  UserListModule,
} from '../../userFiles/user-list/user-list.component';
// import { UserAddModule } from '../../userFiles/user-add/user-add.component';
// import { UserListComponent } from '../../userFiles/user-list/user-list.component';
import { InvoiceAddModule } from '../../invoice-add/invoice-add.component';
import { DataService } from 'src/app/services';
import { InvoiceViewModule } from '../invoice-view/invoice-view.component';
import { InvoiceListUpdateService } from 'src/app/services/invoice-list-update.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent {
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
Department: any = {};
loggedInUser : any = {}
  dateTimeFormat = {
    type: 'datetime',
    format: 'dd-MM-yyyy hh:mm tt',
  };
  isEditPopupVisible = false;
  selectedInvoice: any = null;

  addInvoicePopupOpened: boolean = false;
  invoiceList: any;
  ID: any;
  storedUserData: string;
  userData: any;
  USER: any;

  constructor(private dataService: DataService,
    private invoiceUpdateService: InvoiceListUpdateService
  ) {}

  ngOnInit() {
    
    this.storedUserData = sessionStorage.getItem('savedUserData');
    console.log(this.storedUserData, 'STOREDUSERDATA');
    if (this.storedUserData) {
      this.userData = JSON.parse(this.storedUserData);
      console.log('User Data in INVOICELIST:', this.userData);
      this.USER = this.userData.USER_TYPE_NAME;
      this.Department.DEPARTMENT_ID = this.userData.DEPARTMENT_ID;
      this.loggedInUser.USER_ID = this.userData.USER_ID
    }

    this.getInvoiceList();
  this.invoiceUpdateService.update$.subscribe(() => {
    console.log('New invoice added — refreshing list...');
    this.getInvoiceList();
  });
  }

  getInvoiceList() {
    const department = this.Department;
    this.dataService.getInvoiceList(this.loggedInUser).subscribe((response: any) => {
      this.invoiceList = response.data;
      console.log(response, 'INVOICELIST');
    });
  }

  formatDate(value: string | Date): string {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}.${minutes}`;
  }

  addInvoice() {
    this.addInvoicePopupOpened = true;
  }

  handleClose() {
    this.isEditPopupVisible = false; // **Important**: hide the popup
    this.addInvoicePopupOpened = false; // if this is related, keep it
    this.getInvoiceList(); // reload list or any other action
  }

  onViewClick(e: any) {
    console.log('POPUP OPENED');
    this.ID = e.row?.data.ID;
    console.log(this.ID, 'ID');
    this.dataService.selectInvoice(this.ID).subscribe((response: any) => {
      this.selectedInvoice = response;
      console.log(this.selectedInvoice, 'SELECTEDINVOICE');
    });
    this.isEditPopupVisible = true;
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

    UserListModule,
    InvoiceAddModule,
    InvoiceViewModule,
  ],
  providers: [],
  exports: [InvoiceListComponent],
  declarations: [InvoiceListComponent],
})
export class InvoiceListModule {}
