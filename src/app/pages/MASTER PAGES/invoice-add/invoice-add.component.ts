import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxTextBoxModule, DxCheckBoxModule, DxRadioGroupModule, DxFileUploaderModule, DxDataGridModule, DxButtonModule, DxValidatorModule, DxProgressBarModule, DxPopupModule, DxDropDownBoxModule, DxToolbarModule, DxTabPanelModule, DxTabsModule, DxNumberBoxModule, DxDataGridComponent, DxSelectBoxComponent, DxTextBoxComponent, DxDateBoxComponent } from 'devextreme-angular';
import { DxoItemModule, DxoFormItemModule, DxoLookupModule, DxiItemModule, DxiGroupModule } from 'devextreme-angular/ui/nested';
import { FormTextboxModule } from 'src/app/components';
import { UserAddComponent } from '../userFiles/user-add/user-add.component';

@Component({
  selector: 'app-invoice-add',
  templateUrl: './invoice-add.component.html',
  styleUrls: ['./invoice-add.component.scss']
})
export class InvoiceAddComponent {
  @ViewChild('departmentBoxRef', { static: false }) departmentBoxRef!: DxSelectBoxComponent;
@ViewChild('billNoBoxRef', { static: false }) billNoBoxRef!: DxTextBoxComponent;
@ViewChild('dateBoxRef', { static: false }) dateBoxRef!: DxDateBoxComponent;
 @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showHeaderFilter: true;
  showFilterRow = true;
  isFilterOpened = false;
  filterRowVisible: boolean = false;
departments: any;
invoice = [
  {
    ITEM_CODE: 'ITM001' // Must match one of the `id` values in itemCodeOptions
  }
];

paymentModes = [
  { id: 1, name: 'Cash' },
  { id: 2, name: 'Credit' }
];
insuranceOptions = [
  { id: 1, name: 'Test1' },
  { id: 2, name: 'Test2' },
  { id: 3, name: 'Test3' },
  { id: 4, name: 'Test4' }
];
schemaOptions = [
  { id: 1, name: 'Schema A' },
  { id: 2, name: 'Schema B' },
  { id: 3, name: 'Schema C' }
];
itemCodeOptions = [
  { id: 'ITM001', name: 'Item 001' },
  { id: 'ITM002', name: 'Item 002' },
  { id: 'ITM003', name: 'Item 003' }
];

  constructor(){
    
  }

  ngOnInit(){}

    customFormat(value: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'decimal', 
      maximumFractionDigits: 2, 
      minimumFractionDigits: 2 
    }).format(value);
  }

onKeyDownHandler(event: any, nextField: string): void {
  if (event.event.key === 'Enter') {
    const nextComponent = (this as any)[nextField];
    if (nextComponent?.instance?.focus) {
      nextComponent.instance.focus(); // ✅ Correct: DevExtreme components use `.instance.focus()`
    }
  }
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
  ],
  providers: [],
  declarations: [InvoiceAddComponent],
  exports: [InvoiceAddComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvoiceAddModule {}