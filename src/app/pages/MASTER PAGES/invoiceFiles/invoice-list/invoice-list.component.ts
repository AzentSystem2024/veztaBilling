import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import { DxDataGridModule, DxButtonModule, DxDropDownButtonModule, DxSelectBoxModule, DxTextBoxModule, DxLookupModule, DxCheckBoxModule, DxPopupModule, DxDataGridComponent } from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { UserAddModule } from '../../userFiles/user-add/user-add.component';
import { UserListComponent } from '../../userFiles/user-list/user-list.component';
import { InvoiceAddModule } from '../../invoice-add/invoice-add.component';

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
  // component.ts
invoices = [
  { Department: 'Cardiology', UHID: 'UH12345', patientName: 'John Doe' },
  { Department: 'Neurology', UHID: 'UH12346', patientName: 'Jane Smith' },
  { Department: 'Orthopedics', UHID: 'UH12347', patientName: 'Alice Johnson' },
  { Department: 'Pediatrics', UHID: 'UH12348', patientName: 'Bob Brown' }
];

  addInvoicePopupOpened: boolean = false;

  constructor() {}

  ngOnInit() {}

  addInvoice() {
    this.addInvoicePopupOpened = true;
  }

  handleClose() {
    this.addInvoicePopupOpened = false;
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
    InvoiceAddModule
  ],
  providers: [],
  exports: [InvoiceListComponent],
  declarations: [InvoiceListComponent],
})
export class InvoiceListModule {}