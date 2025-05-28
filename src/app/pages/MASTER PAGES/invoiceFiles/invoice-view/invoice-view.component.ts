import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, NgModule, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxTextBoxModule, DxCheckBoxModule, DxRadioGroupModule, DxFileUploaderModule, DxDataGridModule, DxButtonModule, DxValidatorModule, DxProgressBarModule, DxPopupModule, DxDropDownBoxModule, DxToolbarModule, DxTabPanelModule, DxTabsModule, DxNumberBoxModule, DxValidationGroupModule, DxAutocompleteModule } from 'devextreme-angular';
import { DxoItemModule, DxoFormItemModule, DxoLookupModule, DxiItemModule, DxiGroupModule } from 'devextreme-angular/ui/nested';
// import { FormTextboxModule } from 'src/app/components';
import { InvoiceAddComponent } from '../../invoice-add/invoice-add.component';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent {
  @Input() invoiceData: any;
  @Output() closePopup = new EventEmitter<void>();
printConfirmVisible: boolean = false;

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoiceData'] && changes['invoiceData'].currentValue) {
      console.log('Invoice data updated:', this.invoiceData);
      // Do something with the new data, e.g., initialize a form or view
    }
  }
    close() {
    this.closePopup.emit();
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
    // FormTextboxModule,
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
  ],
  providers: [],
  declarations: [InvoiceViewComponent],
  exports: [InvoiceViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvoiceViewModule {}