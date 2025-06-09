import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
} from 'devextreme-angular';
import {
  DxoItemModule,
  DxoFormItemModule,
  DxoLookupModule,
  DxiItemModule,
  DxiGroupModule,
} from 'devextreme-angular/ui/nested';
import { FormTextboxModule } from 'src/app/components';
import { DateWiseSummaryComponent } from '../../dateWiseSummary/date-wise-summary/date-wise-summary.component';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-bill-wise-summary',
  templateUrl: './bill-wise-summary.component.html',
  styleUrls: ['./bill-wise-summary.component.scss'],
})
export class BillWiseSummaryComponent {
  billWiseSummaryData: any = [];
  selectedRange: any = 'Today';
  department_list: any;
  user_details: any = [];
  DepartmentData: any = [];
  Hospital_List:any=[];
  Departmens_value: any;
  Hospital_value:any;
  staff_value: any;
  FromDate_value: any;
  staff_Data: any = [];
  isCustomDatePopupVisible: boolean = false;
  fromDate: string | number | Date = new Date();
  toDate: string | number | Date = new Date();
  isEmptyDatagrid: boolean = true;
  isFilterOpened: boolean = false;
  ColumnNames: any;
  today: Date = new Date();
  yesterday: Date = new Date(new Date().setDate(new Date().getDate() - 1));
  monthStart: Date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    2
  );
  startDate: Date = new Date(2025, 3, 25);
  displayMode: any = 'full';
  readonly allowedPageSizes: any = [5, 10, 'all'];
  monthEnd: Date = new Date();
  isFilterRowVisible: boolean = false;
  auto: string = 'auto';
  ToDate_value: any;
  dataGrid: any;

  //====================Date filter  date Ranges============
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

//==============================constructor========================
  constructor(private dataservice: DataService, private fb: FormBuilder) {
    this.getUserDetails();
    this.get_today_data();
  }
  //==========================Default Data show on lookup================== 
get_today_data(){
       if (this.selectedRange === 'Today') {
    // For "All" option, set dates to null or wide range
    this.FromDate_value = new Date;
    this.ToDate_value = new Date()
    console.log('All dates selected - loading complete data');
    this.get_DataSource(); // Load data immediately
  }
}

  //============================Take user Details for get dropdowns of  Hospital and departments=========
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
        console.log(this.user_details.Hospitals)
        this.Hospital_List=this.user_details.Hospitals
        console.log('Department Data:', this.DepartmentData);
        this.staff_Data = this.user_details.Users;
        console.log('Staff Data:', this.staff_Data);
      });
    }
  }

  //===========================Date Range functionality ====================
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
      console.log('Date Range:', this.FromDate_value, '-', this.ToDate_value);

      return;
    }

    if (selected === 'custom') {
      console.log('Custom date range selected');
      this.isCustomDatePopupVisible = true;
      return;
    }

    // Default case (shouldn't happen with proper setup)
    console.warn('Unknown date range selection:', selected);
  }

  // ==============================Custom date picker=============================
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

  //====================Get data api  functionality for bill functionality=========================
  get_DataSource() {
    const departmentId = (this.Departmens_value ?? []).join(',');
    const staffId = (this.staff_value ?? []).join(',');
    const hospitalId=(this.Hospital_value ?? []).join(',')

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
      .Bill_wise_Api(fromDate, toDate, departmentId, staffId,hospitalId)
      .subscribe((res: any) => {
        this.isEmptyDatagrid = false;
        this.billWiseSummaryData = res.Data;
        console.log('Date Wise Summary Data:', this.billWiseSummaryData);
      });
  }




  findColumnLocation(columnName: string) {}

  refresh() {
    this.dataGrid.instance.refresh();
  }

  onExporting(event: any) {
    const fileName = 'Bill Wise Summary Report';
    this.dataservice.exportDataGridReport(event, fileName);
  }
  //======================summary of the all amount and counts=========================== 

  summaryColumnsData = {
    totalItems: [
      {
        column: 'GrossAmt',
        summaryType: 'sum',
        displayFormat: ' {0}',
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
  //========================custom data show on select box of date range===================

  onContextMenuPreparing(e: any) {
    if (e.target === 'header') {
      e.items = e.items || [];

      e.items.push(
        {
          text: 'Group by This Column',
          onItemClick: () => {
            e.component.columnOption(e.column.dataField, 'groupIndex', 0);
          },
        },
        {
          text: 'Ungroup All',
          onItemClick: () => {
            e.component.clearGrouping();
          },
        }
      );
    }
  }
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
  declarations: [BillWiseSummaryComponent],
  exports: [BillWiseSummaryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BillWiseSummaryModule {}
