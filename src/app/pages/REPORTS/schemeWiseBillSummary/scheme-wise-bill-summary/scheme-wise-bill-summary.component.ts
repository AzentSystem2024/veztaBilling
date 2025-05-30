import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxTextBoxModule, DxCheckBoxModule, DxRadioGroupModule, DxFileUploaderModule, DxDataGridModule, DxButtonModule, DxValidatorModule, DxProgressBarModule, DxPopupModule, DxDropDownBoxModule, DxToolbarModule, DxTabPanelModule, DxTabsModule, DxNumberBoxModule, DxValidationGroupModule, DxAutocompleteModule, DxTagBoxModule } from 'devextreme-angular';
import { DxoItemModule, DxoFormItemModule, DxoLookupModule, DxiItemModule, DxiGroupModule } from 'devextreme-angular/ui/nested';
import { FormTextboxModule } from 'src/app/components';
import { SchemeWiseSummaryComponent } from '../../schemeWiseSummary/scheme-wise-summary/scheme-wise-summary.component';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-scheme-wise-bill-summary',
  templateUrl: './scheme-wise-bill-summary.component.html',
  styleUrls: ['./scheme-wise-bill-summary.component.scss']
})
export class SchemeWiseBillSummaryComponent {

dataSource: any = [];
selectedRange: any = null;
dateRanges: any = []
department_list:any
constructor(private dataservice:DataService){
  this.datewiseData()

}
datewiseData() {
  // this.dataservice.Date_wise_Api().subscribe((res: any) => {
  //   this.dataSource = res;
  //   console.log('Date Wise Summary Data:', this.dataSource);
  //   console.log(res);
    
    
  // });
}
onDateRangeChange(event: any) {

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
  declarations: [SchemeWiseBillSummaryComponent],
  exports: [SchemeWiseBillSummaryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SchemeWiseBillSummaryModule {}