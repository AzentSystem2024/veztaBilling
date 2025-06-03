import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DxAutocompleteModule, DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxFileUploaderModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxProgressBarModule, DxRadioGroupModule, DxSelectBoxModule, DxTabPanelModule, DxTabsModule, DxTagBoxModule, DxTextAreaModule, DxTextBoxModule, DxToolbarModule, DxValidationGroupModule, DxValidatorModule } from 'devextreme-angular';
import { DxiGroupModule, DxiItemModule, DxoFormItemModule, DxoItemModule, DxoLookupModule } from 'devextreme-angular/ui/nested';
import { FormTextboxModule } from 'src/app/components';

@Component({
  selector: 'app-hospital-wise-summary',
  templateUrl: './hospital-wise-summary.component.html',
  styleUrls: ['./hospital-wise-summary.component.scss']
})
export class HospitalWiseSummaryComponent {

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
  declarations: [HospitalWiseSummaryComponent],
  exports: [HospitalWiseSummaryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HospitalWiseSummaryModule {}
