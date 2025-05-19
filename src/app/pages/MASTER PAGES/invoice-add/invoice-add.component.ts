import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  NgModule,
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
  DxDataGridComponent,
  DxSelectBoxComponent,
  DxTextBoxComponent,
  DxDateBoxComponent,
  DxButtonComponent,
  DxValidationGroupComponent,
  DxValidationGroupModule,
} from 'devextreme-angular';
import {
  DxoItemModule,
  DxoFormItemModule,
  DxoLookupModule,
  DxiItemModule,
  DxiGroupModule,
} from 'devextreme-angular/ui/nested';
import notify from 'devextreme/ui/notify';
import { FormTextboxModule } from 'src/app/components';
import { DataService } from 'src/app/services';
// import { UserAddComponent } from '../userFiles/user-add/user-add.component';

@Component({
  selector: 'app-invoice-add',
  templateUrl: './invoice-add.component.html',
  styleUrls: ['./invoice-add.component.scss'],
})
export class InvoiceAddComponent {
  
  @ViewChild('invoiceFormGroup') invoiceFormGroup: DxValidationGroupComponent;
  @ViewChild('itemsGridRef') itemsGridRef: any;
  @ViewChild('departmentBoxRef', { static: false })
  departmentBoxRef!: DxSelectBoxComponent;
  @ViewChild('patientBoxRef', { static: false })
  patientBoxRef!: DxTextBoxComponent;
  @ViewChild('mobileBoxRef', { static: false })
  mobileBoxRef!: DxTextBoxComponent;
  @ViewChild('billNoBoxRef', { static: false })
  billNoBoxRef!: DxTextBoxComponent;
  @ViewChild('dateBoxRef', { static: false }) dateBoxRef!: DxDateBoxComponent;
  @ViewChild('wardBoxRef', { static: false }) wardBoxRef!: DxTextBoxComponent;
  @ViewChild('unitBoxRef', { static: false }) unitBoxRef!: DxTextBoxComponent;
  @ViewChild('uhidBoxRef', { static: false }) uhidBoxRef!: DxTextBoxComponent;
  @ViewChild('ageBoxRef', { static: false }) ageBoxRef!: DxTextBoxComponent;
  @ViewChild('sexBoxRef', { static: false }) sexBoxRef!: DxSelectBoxComponent;
  @ViewChild('schemaSelect') schemaSelect!: DxSelectBoxComponent;
  @ViewChild('paymentModeSelect') paymentModeSelect!: DxSelectBoxComponent;
  @ViewChild('insuranceSelect') insuranceSelect!: DxSelectBoxComponent;
@ViewChild('saveButton', { read: ElementRef }) saveButtonElementRef!: ElementRef;
@ViewChild('saveButton') saveButton!: DxButtonComponent;

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
  mobileNumber: string = '+91-';
  mobileValid: boolean = true;
  Department: any = {
    DEPARTMENT_ID: 1,
  };
  formattedInvoiceDate: string = '';
  invoiceFormData: any = {
    INVOICE_NO: '',
    INVOICE_DATE: new Date(),
    DEPARTMENT_ID: '1',
    USER_ID: '1',
    UHID: '',
    PATIENT_NAME: '',
    PATIENT_AGE: '',
    PATIENT_SEX: '',
    PATIENT_MOBILE: '+91-',
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
  billNo: any;
  itemData: { ITEM_ID: number; DEPARTMENT_ID: number };
  selectedItem: any;
schemaPercent: string = '';
readyToConfirm = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getInvoiceNo();
    this.invoiceFormData.INVOICE_DATE = new Date();
    this.formattedInvoiceDate = this.getFormattedDateTime(
      this.invoiceFormData.INVOICE_DATE
    );
    this.getSchemaList();
    // this.getSchema();
    this.getPaymentMode();
    this.getInsuranceOptions();
    this.getItems();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.wardBoxRef?.instance?.focus();
    }, 0);
      if (this.schemaSelect && this.schemaSelect.instance) {
    this.schemaSelect.instance.on('keyDown', (e: any) => {
      if (e.event.key === 'Enter') {
        // Focus and open payment mode select
        setTimeout(() => {
          this.paymentModeSelect.instance.focus();
          this.paymentModeSelect.instance.open();
        }, 50);
      }
    });
      this.paymentModeSelect?.instance?.on('keyDown', (e: any) => {
    if (e.event.key === 'Enter') {
      setTimeout(() => {
        if (this.selectedPaymentModeId === this.creditModeId) {
          // Focus insurance select if Credit
          this.insuranceSelect?.instance?.focus();
          this.insuranceSelect?.instance?.open();
        } else {
          this.saveButton?.instance?.focus();

          // Listen for Enter key on save button
//          const saveBtnElement = this.saveButtonElementRef?.nativeElement;

//           if (saveBtnElement) {
//   saveBtnElement.addEventListener('keydown', (event: KeyboardEvent) => {
//     if (event.key === 'Enter') {
//       this.submitForm();
//     }
//   });
// }

        }
      }, 50);
    }
  });
  }
  }
  getSchema() {
    this.dataService.getDropdownData('SCHEMA').subscribe((data) => {
      this.schemaOptions = data;
      console.log(this.schemaOptions, 'SCHEMAOPTIONS');
    });
  }

  onGridContentReady(e: any) {
  // Get the summary total for the AMOUNT column
  const summary = e.component.getTotalSummaryValue('AMOUNT');
  this.invoiceFormData.GROSS_AMOUNT = summary?.toFixed(2) ?? '0.00';
  
}

getSchemaList(){
  this.dataService.getSchema().subscribe((response: any) => {
    this.schemaOptions = response.Data;
    console.log(this.schemaOptions,"SCHEMAAAAAAAA")
  })
}

onSchemaChanged(e: any): void {
  const selectedId = e.value;

  const selectedSchema = this.schemaOptions.find(
    (schema: any) => schema.ID === selectedId
  );

  if (selectedSchema) {
    this.invoiceFormData.SCHEMA_PERCENT = selectedSchema.DISCOUNT;
  } else {
    this.invoiceFormData.SCHEMA_PERCENT = null;
  }
  this.calculateSchemaAmount();
}


// onSchemaChanged(e: any) {
//   const selectedId = e.value;
//   if (selectedId === 1) {
//     this.invoiceFormData.SCHEMA_PERCENT = '10';
//   } else {
//     this.invoiceFormData.SCHEMA_PERCENT = '25';
//   }
//   this.calculateSchemaAmount();
// }

updateNetAmount() {
  const gross = Number(this.invoiceFormData.GROSS_AMOUNT) || 0;
  console.log(gross,"GROSSSSSSSS")
 
  const schema = Number(this.invoiceFormData.SCHEMA_AMOUNT) || 0;
   console.log(schema,"SCHEMAAAAAAAAA")
  this.invoiceFormData.NET_AMOUNT = +(gross - schema).toFixed(2);
  console.log(this.invoiceFormData.NET_AMOUNT,"NETAMOUNT")
}


calculateSchemaAmount() {
  const gross = Number(this.invoiceFormData.GROSS_AMOUNT) || 0;
  const percent = Number(this.invoiceFormData.SCHEMA_PERCENT) || 0;
console.log(this.invoiceFormData.AMOUNT,"====================")
  console.log('GROSS_AMOUNT:', gross, 'SCHEMA_PERCENT:', percent);

  this.invoiceFormData.SCHEMA_AMOUNT = (gross * percent / 100).toFixed(2);
  this.updateNetAmount();
}




  getPaymentMode() {
    this.dataService.getDropdownData('PAYMENT_MODE').subscribe((data) => {
      this.paymentModes = data;
      console.log(this.paymentModes, 'PAYMENTMODES');
    });
  }

  getInsuranceOptions() {
    this.dataService.getDropdownData('INSURANCE').subscribe((data) => {
      this.insuranceOptions = data;
      console.log(this.insuranceOptions, 'SALARYHEAD');
    });
  }

  getItems() {
    this.dataService.getDropdownData('ITEMS').subscribe((data) => {
      this.items = data;
      console.log(this.items, 'ITEMS');
    });
  }

  getSelectedItemsData(rowIndex: number) {
    this.itemData = {
      ITEM_ID: this.selectedItem.ID,
      DEPARTMENT_ID: 1,
    };
    this.dataService.getItemsData(this.itemData).subscribe((response: any) => {
      if (response?.data?.length) {
        const item = response.data[0];

        // Update the grid row values
        this.itemsGridRef?.instance?.cellValue(
          rowIndex,
          'ITEM_ID',
          item.ITEM_ID
        );
        this.itemsGridRef?.instance?.cellValue(
          rowIndex,
          'ITEM_NAME',
          item.ITEM_NAME
        );
        this.itemsGridRef?.instance?.cellValue(rowIndex, 'PRICE', item.PRICE);
        this.itemsGridRef?.instance?.cellValue(
          rowIndex,
          'IS_FIXED',
          item.IS_FIXED
        );
              setTimeout(() => {
        this.itemsGridRef?.instance?.focus(
          this.itemsGridRef?.instance?.getCellElement(rowIndex, 'QUANTITY')
        );
      }, 0);
      }
    });
  }

  

calculateAmount = (rowData: any) => {
  const price = parseFloat(rowData.PRICE || 0);
  const quantity = parseFloat(rowData.QUANTITY || 0);
  return price * quantity;
};

onCalculateCustomSummary(e: any) {
  console.log('onCalculateCustomSummary called', e);
  if (e.summaryProcess === "start") {
    e.totalValue = 0;
  }
  if (e.summaryProcess === "calculate") {
    e.totalValue += e.value;
  }
  if (e.summaryProcess === "finalize") {
    // finalize if needed
  }
}




  onCellChanged(e: any) {
    if (e.column.dataField === 'ITEM_ID') {
      const selectedItem = this.items.find((item) => item.ID === e.value);
      if (selectedItem) {
        e.component.cellValue(
          e.rowIndex,
          'DESCRIPTION',
          selectedItem.DESCRIPTION
        );
      }
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

  getInvoiceNo() {
    const department = this.Department;
    this.dataService.getInvoiceNo(department).subscribe((response: any) => {
      this.invoiceFormData.INVOICE_NO = response.data;
      // this.invoiceFormData.INVOICE_NO = this.billNo;
      console.log(this.billNo, 'Invoice no.');
    });
  }

  customFormat(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  }

  validateMobileNumber(value: string): void {
    const regex = /^\+91-\d{10}$/;
    this.mobileValid = regex.test(value);
  }

  onMobileInput(event: any): void {
    let input = event.event.target.value;

    // Ensure +91- is always prefixed
    if (!input.startsWith('+91-')) {
      input = '+91-' + input.replace(/[^0-9]/g, '').slice(0, 10); // allow only digits
    }

    // Extract the digits after +91-
    const digits = input
      .replace('+91-', '')
      .replace(/[^0-9]/g, '')
      .slice(0, 10);
    this.mobileNumber = '+91-' + digits;

    this.validateMobileNumber(this.mobileNumber);
  }

  onKeyDownHandler(event: any, nextField: string): void {
    if (event.event.key === 'Enter') {
      const nextComponent = (this as any)[nextField];

      if (nextComponent?.instance?.focus) {
        nextComponent.instance.focus(); // Focus the next field

        // If it's a select box, open the dropdown
        if (nextComponent.instance.open) {
          // Give it a slight delay to allow focus to finish first
          setTimeout(() => {
            nextComponent.instance.open();
          }, 50);
        }
      }
    }
  }

  onSexKeyDown(event: any): void {
    if (event.event.key === 'Enter') {
      // Focus on the grid and start editing the ITEM_CODE cell in the first row
      setTimeout(() => {
        this.itemsGridRef?.instance?.focus();
        this.itemsGridRef?.instance?.editCell(0, 'ITEM_CODE');
      }, 50);
    }
  }

  onEditorPreparing(e: any): void {
    if (e.parentType === 'dataRow') {
      const rowIndex = e.row.rowIndex;

      // ITEM_ID
      if (e.dataField === 'ITEM_ID') {
        let enterPressedOnce = false;
      const selectedItemIds = this.itemsGridRef.instance.getVisibleRows()
        .filter(row => row.rowIndex !== rowIndex)
        .map(row => row.data?.ITEM_ID)
        .filter(id => id !== undefined && id !== null);

      // 👇 Set dynamic dataSource for lookup
      e.editorOptions.dataSource = this.items.filter(
        item => !selectedItemIds.includes(item.ID)
      );
        e.editorOptions.onKeyDown = (event: any) => {
          const key = event.event.key;

          if (key === 'Enter') {
            event.event.preventDefault();

            const editorInstance = event.component;

            if (!enterPressedOnce) {
              enterPressedOnce = true;

              setTimeout(() => {
                if (editorInstance?.open) {
                  editorInstance.open();
                }
              }, 50);
            } else {
              setTimeout(() => {
                this.itemsGridRef?.instance?.editCell(rowIndex, 'QUANTITY');
              }, 50);

              enterPressedOnce = false;
            }
          }
        };

        // <-- ADD onValueChanged here -->
        e.editorOptions.onValueChanged = (args: any) => {
          console.log('api called++++++++++++++');
          const selectedId = args.value;
          this.selectedItem = this.items.find(
            (item: any) => item.ID === selectedId
          );
          console.log('Selected item:', this.selectedItem);

          if (this.selectedItem) {
            this.getSelectedItemsData(rowIndex);
          } else {
            e.component.cellValue(rowIndex, 'DESCRIPTION', '');
          }
        };
      }
      if (e.dataField === 'QUANTITY') {
        e.editorOptions.onKeyDown = (event: any) => {
          const key = event.event.key;

          if (key === 'Enter') {
            // event.event.preventDefault();

            setTimeout(() => {
              const grid = this.itemsGridRef?.instance;

              // Ensure QUANTITY is not empty before adding a new row
              const quantityValue = grid.cellValue(rowIndex, 'QUANTITY');
              const itemIdValue = grid.cellValue(rowIndex, 'ITEM_ID');

              if (
                itemIdValue &&
                quantityValue != null &&
                quantityValue !== ''
              ) {
                // Optional: commit any changes
                grid.saveEditData();

                // Add a new row
                // grid.addRow();

                const maxRows = this.items.length;
                console.log(maxRows, 'MAXROWS');
                console.log(this.items, 'ITEMSSSSSS');

                // const currentRows = grid.getVisibleRows().length;
                let currentRows = grid.option('dataSource')?.length ?? 0;
                console.log(currentRows, 'currentrow');
                // Focus new row (optional)
                if (currentRows < maxRows) {
                  grid.addRow();
                } else {
                  // Optional: show some notification about max rows reached
                  console.warn('Maximum row limit reached');
                  this.schemaSelect.instance.focus();
                  this.schemaSelect.instance.open();
                }
              }
            }, 50);
          }
        };
      }
    }
  }

onRowRemoving(e: any) {
  console.log("deletion trigerred")
  const index = this.items.findIndex(item => item.ID === e.data.ID);
  if (index !== -1) {
    this.items.splice(index, 1); // actually remove it from the array
  }
}

  

  convertNumbersToStrings(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => this.convertNumbersToStrings(item));
  } else if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value === 'number') {
          result[key] = value.toString();
        } else {
          result[key] = this.convertNumbersToStrings(value);
        }
      }
    }
    return result;
  }
  return obj;
}


handleGridKeyDown(e: any) {
  if (e.event.key === 'Tab') {
    e.event.preventDefault(); // Stop the default tab behavior

    // Focus the schema select box
    setTimeout(() => {
      this.schemaSelect.instance.focus();
      this.schemaSelect.instance.open(); // Optional: open the dropdown
    }, 0);
  }
}



  showConfirm() {
    this.confirmVisible = true;
      setTimeout(() => {
    this.readyToConfirm = true;
  }, 300);
  }

onConfirm(result: boolean) {
  this.confirmVisible = false;
  this.readyToConfirm = false;

  if (result) {
    this.submitForm();
  } else {
    notify('Save cancelled', 'warning', 2000);
  }
}



  submitForm() {
    const result = (this.invoiceFormGroup.instance.validate().isValid)

    if (result) {
      console.log('Form is valid. Submitting data...');
      this.save(); // Your method to handle form submission
    } else {
      console.log('Form has errors. Please correct them.');
    }
  }

@HostListener('document:keydown.enter', ['$event'])
handleEnterKey(event: KeyboardEvent) {
  if (this.confirmVisible && this.readyToConfirm) {
    event.preventDefault();
    this.onConfirm(true);
  }
}




save() {
  
  console.log("SAVE TRIGGERED");

  // Clone the data to avoid mutating the original form
  const clonedData = { ...this.invoiceFormData };

  // Clean and transform INVOICE_ENTRY
  clonedData.INVOICE_ENTRY = (clonedData.INVOICE_ENTRY || []).map(entry => ({
    ITEM_ID: entry.ITEM_ID,
    QUANTITY: entry.QUANTITY,
    UNIT_PRICE: entry.PRICE ?? entry.UNIT_PRICE,
    AMOUNT: entry.QUANTITY && (entry.PRICE ?? entry.UNIT_PRICE)
      ? (+entry.QUANTITY * +entry.PRICE).toFixed(2)
      : '0.00',
  }));

  // Format the date

clonedData.INVOICE_DATE = new Date().toISOString();

  // Convert numbers to strings
  const dataToSave = this.convertNumbersToStrings(clonedData);

  // Save to backend
  this.dataService.saveInvoiceData(dataToSave).subscribe((response: any) => {
    console.log(response, 'SAVE');
  if (response.flag == "1") {
    notify(
      {
        message: 'Invoice Entered Successfully',
        position: { at: 'top center', my: 'top center' },
      },
      'success'
    );

  } else {
    notify(
      {
        message: 'Invoice Not Generated',
        position: { at: 'top right', my: 'top right' },
      },
      'error'
    );
  }
    // Reset form
    this.invoiceFormData = {
      INVOICE_DATE: new Date().toISOString(),
      PATIENT_MOBILE:'+91-',
      PATIENT_SEX: '',
      INVOICE_ENTRY: [
      {
        ITEM_ID: '',

        QUANTITY: '',
        UNIT_PRICE: '',
        AMOUNT: '',
      },
    ],
    };
    this.formattedInvoiceDate = this.getFormattedDateTime(new Date());
    this.getInvoiceNo();
this.invoiceFormGroup.instance.reset();
    // Focus on ward field
    setTimeout(() => {
      this.wardBoxRef?.instance?.focus();
    }, 0);
  });
}

cancel(){
      // Reset form
    this.invoiceFormData = {
      INVOICE_DATE: new Date().toISOString(),
      PATIENT_MOBILE:'+91-',
      PATIENT_SEX: '',
      UHID: '',
      PATIENT_AGE: '',
      INVOICE_ENTRY: [
      {
        ITEM_ID: '',

        QUANTITY: '',
        UNIT_PRICE: '',
        AMOUNT: '',
      },
    ],
    };
    this.formattedInvoiceDate = this.getFormattedDateTime(new Date());
    this.invoiceFormGroup.instance.reset();
    this.getInvoiceNo();
        setTimeout(() => {
      this.wardBoxRef?.instance?.focus();
    }, 0);
}

validateMobile = (e: any) => {
  const value = e.value || '';
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(value);
};


onPaymentModeChange(event: any): void {
  setTimeout(() => {
    if (this.selectedPaymentModeId === this.creditModeId) {
      this.insuranceSelect?.instance?.focus();
    } else {
      this.saveButton?.instance?.focus();
    }
  }, 50);
}

  printInvoice() {
    const printContents = document.getElementById('invoiceToPrint')?.innerHTML;

    if (printContents) {
      const popupWin = window.open('', '_blank', 'width=800,height=900');
      if (popupWin) {
        popupWin.document.open();
        popupWin.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 5px;
                text-align: left;
              }
              .dx-datagrid {
                font-size: 12px;
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
        popupWin.document.close();
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
    DxValidationGroupModule
  ],
  providers: [],
  declarations: [InvoiceAddComponent],
  exports: [InvoiceAddComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvoiceAddModule {}
