import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  NgZone,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  DxValidationGroupComponent,
  DxSelectBoxComponent,
  DxDataGridComponent,
} from 'devextreme-angular';
import {
  DxoItemModule,
  DxoFormItemModule,
  DxoLookupModule,
  DxiItemModule,
  DxiGroupModule,
} from 'devextreme-angular/ui/nested';
import { FormTextboxModule } from 'src/app/components';
import { InvoiceAddComponent } from '../../invoice-add/invoice-add.component';
import { DataService } from 'src/app/services';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
})
export class InvoiceViewComponent {
  @Input() invoiceData: any;
@Output() popupClosed = new EventEmitter<void>();
@ViewChild('keyContainer') keyContainer!: ElementRef;
  printConfirmVisible: boolean = false;
  invoiceEntry: any;
  storedUserData: string;
  USER: any;

  formatInvoiceDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${date.getDate().toString().padStart(2, '0')}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
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
  data:{
    ID:"",
    CANCEL_REASON:"CANCELLED",
    CANCEL_USER_ID:"",
    CANCEL_TIME:""
  }

  constructor(private dataService: DataService, private ngZone: NgZone) {}

  ngOnInit() {
    this.storedUserData = sessionStorage.getItem('savedUserData');
    console.log(this.storedUserData,"STOREDUSERDATA")
        if (this.storedUserData) {
      this.userData = JSON.parse(this.storedUserData);
      console.log('User Data in InvoiceComponent:', this.userData);
      this.USER = this.userData.USER_TYPE_NAME;
        }
    this.formattedInvoiceDate = this.getFormattedDateTime(
      this.invoiceFormData.INVOICE_DATE
    );
  }

    @HostListener('document:keydown.enter', ['$event'])
  handleGlobalEnterKey(event: KeyboardEvent): void {
    event.preventDefault(); // Prevent default behavior
    this.previewAndPrintInvoice(); // Call your function
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoiceData'] && changes['invoiceData'].currentValue) {
      console.log('Invoice data updated:', this.invoiceData);
      this.invoiceEntry = this.invoiceData.INVOICE_ENTRY || [];
    }
  }


handleKeyEvents(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault();
    this.previewAndPrintInvoice();
  } else if (event.key === 'Escape') {
    this.popupClosed.emit(); // Close popup on Escape
  }
}


cancelBillPrint(){
    const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const userId = String(this.userData?.USER_ID || '');
  const data = {
    ID: String(this.invoiceData?.ID || ''),
    CANCEL_REASON: 'CANCELLED',
    CANCEL_USER_ID: userId, // Adjust the key if needed
    CANCEL_TIME: formattedDate // current time in ISO format
  };
  console.log(data,"DATA")
  this.dataService.cancelBill(data).subscribe((response: any) => {
      if (response.flag == '1') {
        this.printData = response.data;
        console.log(this.printData, 'PRINTDATAAAAAAAAAAAA');
        notify(
          {
            message: 'Invoice Cancelled',
            position: { at: 'top center', my: 'top center' },
          },
          'success'
        );
    this.popupClosed.emit();
      } else {
        notify(
          {
            message: 'Invoice Not Cancelled',
            position: { at: 'top right', my: 'top right' },
          },
          'error'
        );
      }
  })
}
  
updateAmountInWords(): void {
  const amount = this.invoiceFormData.NET_AMOUNT;
  if (amount && !isNaN(amount)) {
    this.amountInWords = this.convertNumberToWords(Number(amount));
  } else {
    this.amountInWords = '';
  }
}
convertNumberToWords(amount: number): string {
  // You can enhance this for large amounts
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
    'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (amount === 0) return 'Zero Rupees Only';

  const numToWords = (num: number): string => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred ' + (num % 100 ? numToWords(num % 100) : '');
    if (num < 100000) return numToWords(Math.floor(num / 1000)) + ' Thousand ' + (num % 1000 ? numToWords(num % 1000) : '');
    if (num < 10000000) return numToWords(Math.floor(num / 100000)) + ' Lakh ' + (num % 100000 ? numToWords(num % 100000) : '');
    return numToWords(Math.floor(num / 10000000)) + ' Crore ' + (num % 10000000 ? numToWords(num % 10000000) : '');
  };
 const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = numToWords(rupees) + ' Rupees';

  if (paise > 0) {
    words += ' and ' + paise + ' Paise';
  }

  return words;
  // return numToWords(Math.floor(amount)) + ' Rupees Only';
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
    this.popupClosed.emit();
  }

previewAndPrintInvoice(): void {
  const data = this.invoiceData;
  console.log(data, "DATA");

  const amount = Number(data.NET_AMOUNT);
  const amountInWords = this.convertNumberToWords(amount);

  const printWindow = window.open('', '_blank', 'width=800,height=700');

  const htmlContent = `
<html>
  <head>
    <title>${data.SCHEMA_NAME ? 'CREDIT BILL' : 'CASH BILL'}</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: 'Segoe UI', Tahoma, sans-serif;
        font-size: 14px;
        padding: 20px;
        margin: 0;
        background-color: #fff;
        color: #000;
      }

      .bill-container {
        width: 100%;
        margin: auto;
        padding: 10px; /* reduced padding */
        border: 1px solid #000;
      }

      .header-table, .info-table, .invoice-table, .scheme-table, .footer-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }

      .header-table td, .info-table td {
        padding: 4px 8px;
      }

      .invoice-table th, .invoice-table td,
      .scheme-table th, .scheme-table td {
        border: 1px solid #000;
        padding: 6px;
        text-align: center;
      }

      .label {
        font-weight: bold;
      }

      .right-align {
        text-align: right;
      }

      .amount-in-words {
        margin-top: 30px;
        font-weight: bold;
      }

    </style>
  </head>
  <body onload="window.print(); window.close();">
    <div class="bill-container">
      <table class="header-table">
        <tr>
          <td><strong>${(!data.SCHEMA_NAME || !data.SCHEMA_NAME.trim()) ? 'CASH BILL' : 'CREDIT BILL'}</strong></td>
          <td style="text-align: center;"><strong>BILLED BY:</strong> ${(this.USER)}</td>
          <td style="text-align: right;"><strong>COMPANY NAME:</strong>${(data.DEPARTMENT)}</td>
        </tr>
      </table>

      <table class="info-table">
        <tr>
          <td><span class="label">RECEIPT NUMBER:</span> ${data.INVOICE_NO}</td>
        </tr>
        <tr>
          <td><span class="label">PATIENT NAME:</span> ${data.PATIENT_NAME}</td>
          <td><span class="label">AGE:</span> ${data.PATIENT_AGE}</td>
          <td><span class="label">RECEIPT DATE:</span> ${this.formattedInvoiceDate}</td>
        </tr>
      </table>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>SL NO.</th>
            <th>SERVICE NAME</th>
            <th>QUANTITY</th>
            <th>RATE PER ITEM</th>
            <th>DISCOUNT</th>
            <th>NET AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          ${data.INVOICE_ENTRY.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.ITEM_NAME}</td>
              <td>${item.QUANTITY}</td>
              <td>${item.UNIT_PRICE}</td>
              <td>${item.DISCOUNT || 0}</td>
              <td>${item.AMOUNT}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${data.SCHEMA_NAME ? `
        <table class="scheme-table">
          <thead>
            <tr>
              <th>SCHEME:</th>
              <th>Scheme Account No:</th>
              <th>Amount in Scheme</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.SCHEMA_NAME}</td>
              <td>${data.SCHEMA_ACCOUNT_NO || ''}</td>
              <td>${data.SCHEMA_AMOUNT || ''}</td>
            </tr>
          </tbody>
        </table>` : ''
      }

      <table class="footer-table">
        <tr>
          <td class="right-align"><strong>RECEIPT AMOUNT:</strong> ₹${data.GROSS_AMOUNT}</td>
        </tr>
        <tr>
          <td class="right-align"><strong>CREDIT AMOUNT:</strong> ₹${data.NET_AMOUNT}</td>
        </tr>
      </table>

      <div class="amount-in-words">
        AMOUNT IN WORDS: ${amountInWords}
      </div>

    </div>
  </body>
</html>
`;

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  printWindow.onbeforeunload = () => {
    this.ngZone.run(() => {
      this.printConfirmVisible = false;
    });
  };


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
