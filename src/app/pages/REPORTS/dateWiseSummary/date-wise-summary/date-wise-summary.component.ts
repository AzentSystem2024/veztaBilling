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
  selectedRange: any = 'Today';
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
   Hospital_List:any=[];
    Hospital_value:any;
  readonly allowedPageSizes: any = [5, 10, 'all'];
  isFilterRowVisible: boolean = false;
  auto: string = 'auto';
  yesterday: Date = new Date(new Date().setDate(new Date().getDate() - 1));
  monthStart: Date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    2
  );
  startDate: Date = new Date(2025, 3, 25);
  monthEnd: Date = new Date();

  //======================= Date Ranges of date filter =========================

  dateRanges = [
  
    {
      label: 'Today',
      value: { start: new Date(), end: new Date() },
    },
    
    {
      label: 'Yesterday',
      value: {
        start: new Date(new Date().setDate(new Date().getDate() - 1)),
        end: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    },
    {
      label: 'This Month',
      value: { start: this.monthStart, end: this.monthEnd },
    },
      { label: 'All', value: 'all' },
    {
      label: 'Custom',
      value: 'custom',
    },
  ];

  ToDate_value: any;

  constructor(private dataservice: DataService, private fb: FormBuilder) {
    this.getUserDetails();

    this.get_today_data();
  }

  //======================= Default loading Data on LookUp (All Data)=========================

  
get_today_data(){
       if (this.selectedRange === 'Today') {
    // For "All" option, set dates to null or wide range
    this.FromDate_value = new Date;
    this.ToDate_value = new Date()
    console.log('All dates selected - loading complete data');
    this.get_DataSource(); // Load data immediately
  }
}

  //=======================User Details  ===============================

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

        console.log(this.user_details.Hospitals);
        this.Hospital_List = this.user_details.Hospitals;

        console.log(this.user_details.Departments);
        this.DepartmentData = this.user_details.Departments;

        console.log('Department Data:', this.DepartmentData);
        this.staff_Data = this.user_details.Users;
        console.log('Staff Data:', this.staff_Data);
      });
    }
  }

  //=======================  date Range  change functionality  of Date Range dropdow ========================

  onDateRangeChange(event: any) {
    const selected = event.value;
    console.log(event);

    if (selected === 'all') {
      this.FromDate_value = this.startDate;
      this.ToDate_value = new Date();
      console.log('All dates selected');
      // this.get_DataSource();
      return;
    }

    if (typeof selected === 'object' && selected.start && selected.end) {
      // Handle date range objects
      this.FromDate_value = new Date(selected.start);
      this.ToDate_value = new Date(selected.end);
      console.log('Date Range:', this.FromDate_value, 'to', this.ToDate_value);

      return;
    }

    if (selected === 'custom') {
      console.log('Custom date range selected');
      this.isCustomDatePopupVisible = true;
      return;
    }
  }

  // Keep your improved applyCustomDate
  //============================== Functions for apply custom date=================================
  applyCustomDate() {
    if (!this.fromDate || !this.toDate) {
      alert('Please select both From and To dates.');
      return;
    }

    const fromDate = new Date(this.fromDate);
    const toDate = new Date(this.toDate);

    if (fromDate > toDate) {
      alert('From Date cannot be after To Date.');
      return;
    }

    this.FromDate_value = fromDate;
    this.ToDate_value = toDate;

    this.selectedRange = {
      label: `${this.formatDate(this.FromDate_value)} - ${this.formatDate(
        this.ToDate_value
      )}`,
      value: 'custom',
    };

    this.isCustomDatePopupVisible = false;
  }

  // Helper method to format dates consistently
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  //========================= get lookup data==============================
  get_DataSource() {
    const departmentId = (this.Departmens_value ?? []).join(',');
    const staffId = (this.staff_value ?? []).join(',');
const hospital_id=(this.Hospital_value?? []).join(',');
    // Ensure dates are valid Date objects before formatting
    const fromDate = this.FromDate_value
      ? this.formatDate(new Date(this.FromDate_value))
      : '';
    const toDate = this.ToDate_value
      ? this.formatDate(new Date(this.ToDate_value))
      : '';

    if (!fromDate || !toDate) {
      console.error('Invalid date range');
      return;
    }

    this.dataservice
      .Date_wise_Api(fromDate, toDate, departmentId, staffId,hospital_id)
      .subscribe((res: any) => {
        this.isEmptyDatagrid = false;
        this.dateWiseSummaryData = res.Data;
        console.log('Date Wise Summary Data:', this.dateWiseSummaryData);
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
  //==========summery of all Amount and counts ================

  summaryColumnsData = {
    totalItems: [
      {
        column: 'NoOfBills',
        summaryType: 'sum',
        displayFormat: '{0}',
        valueFormat: { type: 'fixedPoint', precision: 2, useGrouping: true },
        showInColumn: 'NoOfBills',
        alignment: 'Right',
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
      {
        column: 'Upi',
        summaryType: 'sum',
        displayFormat: '{0}',
        valueFormat: { type: 'fixedPoint', precision: 2, useGrouping: true },
        showInColumn: 'Upi',
        alignment: 'right',
      },
    ],
    calculateCustomSummary: (options) => {
      if (options.name === 'summaryRow') {
        // Custom logic if needed
      }
    },
  };
  //=======================filter row hide and show functionality=========================

  toggleFilterRow = () => {
    this.isFilterRowVisible = !this.isFilterRowVisible;
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
