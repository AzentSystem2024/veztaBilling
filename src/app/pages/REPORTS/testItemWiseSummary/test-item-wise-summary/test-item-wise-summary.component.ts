import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxTextBoxModule, DxCheckBoxModule, DxRadioGroupModule, DxFileUploaderModule, DxDataGridModule, DxButtonModule, DxValidatorModule, DxProgressBarModule, DxPopupModule, DxDropDownBoxModule, DxToolbarModule, DxTabPanelModule, DxTabsModule, DxNumberBoxModule, DxValidationGroupModule, DxAutocompleteModule, DxTagBoxModule } from 'devextreme-angular';
import { DxoItemModule, DxoFormItemModule, DxoLookupModule, DxiItemModule, DxiGroupModule } from 'devextreme-angular/ui/nested';
import { FormTextboxModule } from 'src/app/components';
import { SchemeWiseSummaryComponent } from '../../schemeWiseSummary/scheme-wise-summary/scheme-wise-summary.component';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-test-item-wise-summary',
  templateUrl: './test-item-wise-summary.component.html',
  styleUrls: ['./test-item-wise-summary.component.scss']
})
export class TestItemWiseSummaryComponent {

itemWiseSummaryData: any = []; 
 selectedRange: any = null;
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
  isFilterOpened: boolean = false;
    ColumnNames: any;
     summaryColumnsData: any;
     monthStart: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 2);
// Today's date (e.g., May 30, 2025)
monthEnd: Date = new Date();
  dateRanges = [
    { label: 'Today', value: new Date() },
    {
      label: 'Yesterday',
      value: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
    label: 'This Month',
    value: { start: this.monthStart, end: this.monthEnd },
  },
    { label: 'Custom', value: 'custom' },
  ];
  ToDate_value: any;
  dataGrid: any;

  constructor(private dataservice: DataService, private fb: FormBuilder) {
   
    this.getUserDetails();
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
    } 
    else if (selected?.start && selected?.end) {
    // For ranges like "This Month"
    this.FromDate_value = this.monthStart
    
    
    ;
    this.ToDate_value = this.monthEnd
    console.log('Date Range:', this.FromDate_value, 'to', this.ToDate_value);
  }
    else {
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
    const departmentId = this.Departmens_value.join(',');
    const staffId = this.staff_value.join(',');
    console.log('Selected Department ID:', departmentId);
    console.log('Selected Staff ID:', staffId);
    console.log('Selected Date Range:', date);
    console.log('From Date:', this.FromDate_value.toISOString().split('T')[0]);
    console.log('To Date:', this.ToDate_value.toISOString().split('T')[0]);
    const fromDate = this.FromDate_value.toISOString().split('T')[0];
    const ToDate = this.ToDate_value.toISOString().split('T')[0];
    this.dataservice
      .item_wise_Api(fromDate, ToDate, departmentId, staffId)
      .subscribe((res: any) => {
           this.isEmptyDatagrid = false;
        this.itemWiseSummaryData = res.Data;
        console.log('Date Wise Summary Data:', this.itemWiseSummaryData);
        console.log(res);
      });
  }
public filterClick = () => {
  console.log('Clicked');
  if (this.itemWiseSummaryData) {
    this.isFilterOpened = !this.isFilterOpened;
  }
};
SummaryClick(){

}
findColumnLocation(columnName: string) {

}
refresh(){
  this.dataGrid.instance.refresh();

}
 onExporting(event: any) {
    const fileName = 'Test Item Wise Summary Report';
    this.dataservice.exportDataGridReport(event, fileName);
  }
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
    DxTagBoxModule
  ],
  providers: [],
  declarations: [TestItemWiseSummaryComponent],
  exports: [TestItemWiseSummaryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TestItemWiseSummaryModule {}