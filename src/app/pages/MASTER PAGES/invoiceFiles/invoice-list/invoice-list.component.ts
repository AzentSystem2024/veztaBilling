import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import { DxDataGridModule, DxButtonModule, DxDropDownButtonModule, DxSelectBoxModule, DxTextBoxModule, DxLookupModule, DxCheckBoxModule, DxPopupModule, DxDataGridComponent } from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { UserListComponent, UserListModule } from '../../userFiles/user-list/user-list.component';
// import { UserAddModule } from '../../userFiles/user-add/user-add.component';
// import { UserListComponent } from '../../userFiles/user-list/user-list.component';
import { InvoiceAddModule } from '../../invoice-add/invoice-add.component';
import { DataService } from 'src/app/services';
import { InvoiceViewModule } from '../invoice-view/invoice-view.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
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
    Department: any = {
    DEPARTMENT_ID: 1,
  };

dateTimeFormat = {
  type: "datetime",
  format: "dd-MM-yyyy hh:mm tt"
};
isEditPopupVisible = false;
selectedInvoice: any = null;

  addInvoicePopupOpened: boolean = false;
  invoiceList: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getInvoiceList()
  }

  getInvoiceList(){
    const department = this.Department
    this.dataService.getInvoiceList(department).subscribe((response: any) => {
      this.invoiceList = response.data;
      console.log(response,"INVOICELIST")
    })
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
    this.addInvoicePopupOpened = false;
    // this.getPayrollList();
  }

onViewClick(e: any) {
  console.log("POPUP OPENED")
  this.selectedInvoice = e.row?.data;
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
    InvoiceViewModule

  ],
  providers: [],
  exports: [InvoiceListComponent],
  declarations: [InvoiceListComponent],
})
export class InvoiceListModule {}