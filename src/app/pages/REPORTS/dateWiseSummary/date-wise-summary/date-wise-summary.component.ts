import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  DxSelectBoxModule,
  DxTextAreaModule,
  DxDateBoxModule,
  DxFormModule,
  DxTextBoxModule,
  DxCheckBoxModule,
  DxRadioGroupModule,
  DxFileUploaderModule,
  DxDataGridModule,
  DxButtonModule,
  DxValidatorModule,
  DxProgressBarModule,
  DxPopupModule,
  DxDropDownBoxModule,
  DxToolbarModule,
  DxTabPanelModule,
  DxTabsModule,
  DxNumberBoxModule,
  DxValidationGroupModule,
  DxAutocompleteModule,
  DxTagBoxModule,
  DxDataGridComponent,
} from 'devextreme-angular';
import {
  DxoItemModule,
  DxoFormItemModule,
  DxoLookupModule,
  DxiItemModule,
  DxiGroupModule,
} from 'devextreme-angular/ui/nested';
import * as e from 'express';
import { FormTextboxModule } from 'src/app/components';
import { InvoiceAddComponent } from 'src/app/pages/MASTER PAGES/invoice-add/invoice-add.component';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-date-wise-summary',
  templateUrl: './date-wise-summary.component.html',
  styleUrls: ['./date-wise-summary.component.scss'],
})
export class DateWiseSummaryComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  dateWiseSummaryData: any = [];
  selectedRange: any = 'all';
  department_list: any;
  user_details: any = [];
  DepartmentData: any = [];
  Departmens_value: any;
  staff_value: any;
  FromDate_value: any;
  staff_Data: any = [];
  isCustomDatePopupVisible: boolean = false;
  fromDate: string | number | Date = new Date();
  toDate: string | number | Date = new Date();
  isEmptyDatagrid: boolean = true;
    ColumnNames: any;
  isFilterOpened: boolean = false;
  customRangeLabel: string = 'Custom';
      displayMode: any = 'full';
   readonly allowedPageSizes: any = [ 5,10, 'all'];
  yesterday: Date = new Date(new Date().setDate(new Date().getDate() - 1));
  monthStart: Date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    2
  );
  startDate: Date = new Date(2025, 3, 25); // Months are 0-indexed (0 = January)
  // Start of the year (e.g., January 1, 2025)
  // Today's date (e.g., May 30, 2025)
  monthEnd: Date = new Date();
  dateRanges = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: new Date() },
    {
      label: 'Yesterday',
      value: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
      label: 'This Month',
      value: { start: this.monthStart, end: this.monthEnd },
    },
    { label: this.customRangeLabel, value: 'custom' },
  ];
  ToDate_value: any;

  constructor(private dataservice: DataService, private fb: FormBuilder) {
    this.getUserDetails();

    this.get_alldata();
  }

  applyCustomDate() {
    if (!this.fromDate || !this.toDate) {
      alert('Please select both From and To dates.');
      return;
    }

    if (new Date(this.fromDate) > new Date(this.toDate)) {
      alert('From Date cannot be after To Date.');
      return;
    }
    this.FromDate_value = this.fromDate;
    console.log('FromDate_value Date Range:', this.FromDate_value);
    this.ToDate_value = this.toDate;

    // console.log('ToDate_value Date Range:', this.ToDate_value);
    console.log(
      'Selected Date Range:',
      this.FromDate_value.toISOString().split('T')[0]
    );
    console.log(
      'Selected Date Range:',
      this.ToDate_value.toISOString().split('T')[0]
    );

    this.isCustomDatePopupVisible = false;
  }

  get_alldata() {
    if (this.selectedRange === 'all') {
      // For "All" option, set dates to null or wide range
      this.FromDate_value = this.startDate;
      this.ToDate_value = new Date();
      console.log('All dates selected - loading complete data');
      this.get_DataSource(); // Load data immediately
    }
  }

  getUserDetails() {
    const user_details = sessionStorage.getItem('savedUserData');
    console.log('User ID:', user_details);
    const user_id = user_details ? JSON.parse(user_details).USER_ID : null;
    console.log('Parsed User ID:', user_id);

    if (user_id) {
      this.dataservice.Get_user_Details_Api(user_id).subscribe((res: any) => {
        console.log('User Details:', res);
        this.user_details = res.Data;
        console.log('User Details Data:', this.user_details);
        this.department_list = this.user_details.Departments;
        console.log('Department List:', this.department_list);

        console.log(this.user_details.Departments);
        this.DepartmentData = this.user_details.Departments;

        console.log('Department Data:', this.DepartmentData);
        this.staff_Data = this.user_details.Users;
        console.log('Staff Data:', this.staff_Data);
      });
    }
  }

  onDateRangeChange(event: any) {
    const selected = event.value;
    console.log(event);

    if (selected == 'custom') {
      this.isCustomDatePopupVisible = true;
      console.log('Custom date range selected');
      console.log(event.value);
      // this.applyCustomDate()
    } else if (selected === 'all') {
      // For "All" option, set dates to null or wide range
      this.FromDate_value = this.startDate;
      this.ToDate_value = new Date();
      console.log('All dates selected - loading complete data');
      // this.get_DataSource(); // Load data immediately
    } else if (selected?.start && selected?.end) {
      // For ranges like "This Month"
      this.FromDate_value = this.monthStart;
      this.ToDate_value = this.monthEnd;
      console.log('Date Range:', this.FromDate_value, 'to', this.ToDate_value);
    } else {
      this.FromDate_value = event.value;
      console.log('FromDate_value Date Range:', this.FromDate_value);
      this.ToDate_value = this.FromDate_value;
    }
  }

  get_DataSource() {
    const date =
      this.selectedRange === 'custom'
        ? `${this.fromDate} to ${this.toDate}`
        : this.selectedRange;

    const departmentId = (this.Departmens_value ?? []).join(',');
    const staffId = (this.staff_value ?? []).join(',');
    console.log('Selected Department ID:', departmentId);
    console.log('Selected Staff ID:', staffId);
    console.log('Selected Date Range:', date);
    console.log('From Date:', this.FromDate_value.toISOString().split('T')[0]);
    console.log('To Date:', this.ToDate_value.toISOString().split('T')[0]);
    const fromDate = this.FromDate_value.toISOString().split('T')[0];
    const ToDate = this.ToDate_value.toISOString().split('T')[0];
    this.dataservice
      .Date_wise_Api(fromDate, ToDate, departmentId, staffId)
      .subscribe((res: any) => {
        this.isEmptyDatagrid = false;
        this.dateWiseSummaryData = res.Data;
        console.log('Date Wise Summary Data:', this.dateWiseSummaryData);
        console.log(res);
      });
  }
  public filterClick = () => {
    console.log('Clicked');
    if (this.dateWiseSummaryData) {
      this.isFilterOpened = !this.isFilterOpened;
    }
  };
  SummaryClick() {}
  findColumnLocation(columnName: string) {}
  refresh() {
    this.dataGrid.instance.refresh();
  }
  onExporting(event: any) {
    const fileName = 'Date Wise Summary Report';
    this.dataservice.exportDataGridReport(event, fileName);
  }
  //========== DataGrid Refreshing ================

  summaryColumnsData = {
    totalItems: [
      {
        column: 'NoOfBills',
        summaryType: 'sum',
        displayFormat: '{0}',
        valueFormat: { type: 'fixedPoint', precision: 2, useGrouping: true },
        showInColumn: 'NoOfBills',
        alignment: 'right',
      },
      {
        column: 'GrossAmt',
        summaryType: 'sum',
        displayFormat: '{0}',
        valueFormat: { type: 'fixedPoint', precision: 2, useGrouping: true },
        showInColumn: 'GrossAmt',
        alignment: 'right',
      },
      {
        column: 'SchemaAmt',
        summaryType: 'sum',
        displayFormat: '{0}',
        valueFormat: { type: 'fixedPoint', precision: 2, useGrouping: true },
        showInColumn: 'SchemaAmt',
        alignment: 'right',
      },
      {
        column: 'NetAmt',
        summaryType: 'sum',
        displayFormat: '{0}',
        valueFormat: { type: 'fixedPoint', precision: 2, useGrouping: true },
        showInColumn: 'NetAmt',
        alignment: 'right',
      },
      {
        column: 'Cash',
        summaryType: 'sum',
        displayFormat: '{0}',
        valueFormat: { type: 'fixedPoint', precision: 2, useGrouping: true },
        showInColumn: 'Cash',
        alignment: 'right',
      },
      {
        column: 'Credit',
        summaryType: 'sum',
        displayFormat: '{0}',
        valueFormat: { type: 'fixedPoint', precision: 2, useGrouping: true },
        showInColumn: 'Credit',
        alignment: 'right',
      },
    ],
    calculateCustomSummary: (options) => {
      if (options.name === 'summaryRow') {
        // Custom logic if needed
      }
    },
  };
}

@NgModule({
  imports: [
    BrowserModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxDateBoxModule,
    DxFormModule,
    DxTextBoxModule,
    FormTextboxModule,
    DxCheckBoxModule,
    DxRadioGroupModule,
    DxFileUploaderModule,
    DxDataGridModule,
    DxButtonModule,
    DxoItemModule,
    DxoFormItemModule,
    DxoLookupModule,
    DxValidatorModule,
    DxProgressBarModule,
    DxPopupModule,
    DxDropDownBoxModule,
    DxButtonModule,
    DxToolbarModule,
    DxiItemModule,
    DxoItemModule,
    DxTabPanelModule,
    DxTabsModule,
    DxiGroupModule,
    FormsModule,
    DxNumberBoxModule,
    DxValidationGroupModule,
    DxAutocompleteModule,
    DxTagBoxModule,
  ],
  providers: [],
  declarations: [DateWiseSummaryComponent],
  exports: [DateWiseSummaryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DateWiseSummaryModule {}
