import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, NgModule, NgZone, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxTextBoxModule, DxCheckBoxModule, DxRadioGroupModule, DxFileUploaderModule, DxDataGridModule, DxButtonModule, DxValidatorModule, DxProgressBarModule, DxPopupModule, DxDropDownBoxModule, DxToolbarModule, DxTabPanelModule, DxTabsModule, DxNumberBoxModule, DxValidationGroupModule, DxAutocompleteModule, DxValidationGroupComponent, DxSelectBoxComponent, DxDataGridComponent } from 'devextreme-angular';
import { DxoItemModule, DxoFormItemModule, DxoLookupModule, DxiItemModule, DxiGroupModule } from 'devextreme-angular/ui/nested';
import { FormTextboxModule } from 'src/app/components';
import { InvoiceAddComponent } from '../../invoice-add/invoice-add.component';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent {
  @Input() invoiceData: any;
  @Output() closePopup = new EventEmitter<void>();
printConfirmVisible: boolean = false;
  invoiceEntry: any;

    formatInvoiceDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
  }
  @ViewChild('invoiceFormGroup') invoiceFormGroup: DxValidationGroupComponent;
  @ViewChild('itemsGridRef') itemsGridRef: any;
  @ViewChild('departmentBoxRef', { static: false })
  departmentBoxRef!: DxSelectBoxComponent;
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
    selectedPaymentModeId: any = null;
    creditModeId = 2; // or the actual ID value for credit mode
    insuranceOptions: any;
    confirmVisible = false;
    paymentModes: any;
    schemaOptions: any;
    items: any;
    sexOptions = [
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
      { id: 3, name: 'Other' },
    ];
    mobileNumber: string = '';
    mobileValid: boolean = true;
    mobileTouched = false;
    Department: any = {
      DEPARTMENT_ID: 1,
    };
    formattedInvoiceDate: string = '';
    invoiceFormData: any = {
      INVOICE_NO: '',
      INVOICE_DATE: new Date(),
      DEPARTMENT_ID: '',
      USER_ID: '1',
      UHID: '',
      PATIENT_NAME: '',
      PATIENT_AGE: '',
      PATIENT_SEX: '',
      PATIENT_MOBILE: '',
      WARD: '',
      UNIT: '',
      GROSS_AMOUNT: '',
      SCHEMA_ID: '',
      SCHEMA_PERCENT: '',
      SCHEMA_AMOUNT: '',
      NET_AMOUNT: '',
      PAYMENT_MODE: '',
      INSURANCE_ID: '',
      INVOICE_ENTRY: [
        {
          ITEM_ID: '',
  
          QUANTITY: '',
          UNIT_PRICE: '',
          AMOUNT: '',
        },
      ],
    };
    amountInWords: string = '';
    billNo: any;
    itemData: { ITEM_ID: number; DEPARTMENT_ID: number };
    selectedItem: any;
    schemaPercent: string = '';
    readyToConfirm = false;
    wardOptions: any;
    unitOptions: any;
    itemsData: any;
    printData: any;
    hasQuantityError: boolean = false;
    userData: any;
    departmentName: any;
    itemsOfDepartment: any;
  
    constructor(private dataService: DataService,
      private ngZone: NgZone
    ) {}
  
    ngOnInit(){
          this.formattedInvoiceDate = this.getFormattedDateTime(
      this.invoiceFormData.INVOICE_DATE
    );
    }

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoiceData'] && changes['invoiceData'].currentValue) {
      console.log('Invoice data updated:', this.invoiceData);
      this.invoiceEntry = this.invoiceData.INVOICE_ENTRY || [];
      // Do something with the new data, e.g., initialize a form or view
    }
  }

    getFormattedDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 to 12
    const hourStr = String(hours).padStart(2, '0');

    return `${day}-${month}-${year} ${hourStr}:${minutes} ${ampm}`;
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
  ],
  providers: [],
  declarations: [InvoiceViewComponent],
  exports: [InvoiceViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvoiceViewModule {}