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
  DxAutocompleteModule,
  DxAutocompleteComponent,
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
  @ViewChild('wardBoxRef', { static: false })
  wardBoxRef!: DxAutocompleteComponent;
  @ViewChild('unitBoxRef', { static: false })
  unitBoxRef!: DxAutocompleteComponent;
  @ViewChild('uhidBoxRef', { static: false }) uhidBoxRef!: DxTextBoxComponent;
  @ViewChild('ageBoxRef', { static: false }) ageBoxRef!: DxTextBoxComponent;
  @ViewChild('sexBoxRef', { static: false }) sexBoxRef!: DxSelectBoxComponent;
  @ViewChild('schemaSelect') schemaSelect!: DxSelectBoxComponent;
  @ViewChild('paymentModeSelect') paymentModeSelect!: DxSelectBoxComponent;
  @ViewChild('insuranceSelect') insuranceSelect!: DxSelectBoxComponent;
  @ViewChild('saveButton', { read: ElementRef })
  saveButtonElementRef!: ElementRef;
  @ViewChild('saveButton') saveButton!: DxButtonComponent;
  @ViewChild('yesButton', { static: false }) yesButton: DxButtonComponent;
  @ViewChild('noButton', { static: false }) noButton: DxButtonComponent;

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
    DEPARTMENT_ID: '1',
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
  printConfirmVisible = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getInvoiceNo();
    this.invoiceFormData.INVOICE_DATE = new Date();
    this.formattedInvoiceDate = this.getFormattedDateTime(
      this.invoiceFormData.INVOICE_DATE
    );
    this.startMinuteUpdater();
    this.getSchemaList();
    this.getPaymentMode();
    this.getInsuranceOptions();
    this.getItems();
    this.getWardAndUnit();
  }
  private timerId: any;
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

              const insuranceHandler = () => {
                // Unsubscribe after the first selection
                this.insuranceSelect?.instance?.off(
                  'valueChanged',
                  insuranceHandler
                );
                setTimeout(() => {
                  this.saveButton?.instance?.focus();
                });
              };

              this.insuranceSelect?.instance?.on(
                'valueChanged',
                insuranceHandler
              );
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
      // console.log(this.schemaOptions, 'SCHEMAOPTIONS');
    });
  }

  getWardAndUnit() {
    const department = this.Department;
    this.dataService.getWardAndUnit(department).subscribe((response: any) => {
      this.wardOptions = response.Ward;
      this.unitOptions = response.Unit;
      // console.log(response,"ward and unit")
    });
  }

  onGridContentReady(e: any) {
    // Get the summary total for the AMOUNT column
    const summary = e.component.getTotalSummaryValue('AMOUNT');
    this.invoiceFormData.GROSS_AMOUNT = summary?.toFixed(2) ?? '0.00';
  }

  getSchemaList() {
    this.dataService.getSchema().subscribe((response: any) => {
      this.schemaOptions = response.Data;
      // console.log(this.schemaOptions,"SCHEMAAAAAAAA")
    });
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
    // console.log(gross,"GROSSSSSSSS")

    const schema = Number(this.invoiceFormData.SCHEMA_AMOUNT) || 0;
    //  console.log(schema,"SCHEMAAAAAAAAA")
    this.invoiceFormData.NET_AMOUNT = +(gross - schema).toFixed(2);
    // console.log(this.invoiceFormData.NET_AMOUNT,"NETAMOUNT")
  }

  calculateSchemaAmount() {
    const gross = Number(this.invoiceFormData.GROSS_AMOUNT) || 0;
    const percent = Number(this.invoiceFormData.SCHEMA_PERCENT) || 0;
    // console.log(this.invoiceFormData.AMOUNT,"====================")
    // console.log('GROSS_AMOUNT:', gross, 'SCHEMA_PERCENT:', percent);

    this.invoiceFormData.SCHEMA_AMOUNT = ((gross * percent) / 100).toFixed(2);
    this.updateNetAmount();
  }

  getPaymentMode() {
    this.dataService.getDropdownData('PAYMENT_MODE').subscribe((data) => {
      this.paymentModes = data;
      // console.log(this.paymentModes, 'PAYMENTMODES');
    });
  }

  getInsuranceOptions() {
    this.dataService.getDropdownData('INSURANCE').subscribe((data) => {
      this.insuranceOptions = data;
      // console.log(this.insuranceOptions, 'SALARYHEAD');
    });
  }

  getItems() {
    this.dataService.getDropdownData('ITEMS').subscribe((data) => {
      this.items = data.filter((item: any) => item.ID === 1 || item.ID === 2);
      // console.log(this.items, 'Filtered ITEMS with ID 1 and 2');
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
        this.itemsData = response.data;

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
        this.itemsGridRef?.instance?.columnOption('PRICE', 'editorOptions', {
          format: '#,##0.00',
          readOnly: item.IS_FIXED === true,
          disabled: item.IS_FIXED === true,
        });
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
    // console.log('onCalculateCustomSummary called', e);
    if (e.summaryProcess === 'start') {
      e.totalValue = 0;
    }
    if (e.summaryProcess === 'calculate') {
      e.totalValue += e.value;
    }
    if (e.summaryProcess === 'finalize') {
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

  startMinuteUpdater() {
    // Calculate delay to the next exact minute (e.g., if now is 10:05:23, delay 37 seconds)
    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;

    setTimeout(() => {
      this.updateTime();

      // After the first update, update every full minute
      this.timerId = setInterval(() => {
        this.updateTime();
      }, 60000);
    }, delay);
  }

  updateTime() {
    this.invoiceFormData.INVOICE_DATE = new Date();
    this.formattedInvoiceDate = this.getFormattedDateTime(
      this.invoiceFormData.INVOICE_DATE
    );
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
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
      // console.log(this.billNo, 'Invoice no.');
    });
  }

  customFormat(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  }

  onKeyDownMobile(event: any): void {
    // First: limit input length to 10 digits
    const inputValue = this.invoiceFormData.PATIENT_MOBILE || '';
    const isDigit = /^[0-9]$/.test(event.event.key);

    if (isDigit && inputValue.length >= 10) {
      event.event.preventDefault();
      return;
    }
  }

  onMobileInput(event: any): void {
    let input = event.event.target.value.replace(/\D/g, ''); // Remove non-digits
    input = input.replace(/^0+/, ''); // Remove leading zeros
    input = input.slice(0, 10); // Limit to 10 digits
    input = input.replace(/^0+/, '');
    this.mobileNumber = input;
    this.invoiceFormData.PATIENT_MOBILE = input;

    this.validateMobileNumber(input); // Validates as you type
  }

  validateMobileNumber(value: string): void {
    const regex = /^[1-9][0-9]{9}$/;
    this.mobileValid = regex.test(value);
  }

  onMobileBlur(): void {
    this.mobileTouched = true; // mark as touched once user leaves field
    // validate again on blur
    this.mobileValid = /^[1-9][0-9]{9}$/.test(
      this.invoiceFormData.PATIENT_MOBILE
    );
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

  onPatientNameInput(event: any): void {
    const inputElement = event.event.target;
    const originalValue = inputElement.value;

    // Remove any numeric characters from the value
    const filteredValue = originalValue.replace(/[0-9]/g, '');

    // Update the form model
    this.invoiceFormData.PATIENT_NAME = filteredValue;

    // Also update the actual input value if needed
    inputElement.value = filteredValue;
  }

  onSexKeyDown(event: any): void {
    if (event.event.key === 'Enter') {
      setTimeout(() => {
        const grid = this.itemsGridRef?.instance;
        if (grid) {
          const visibleRows = grid.getVisibleRows();
          if (visibleRows.length > 0) {
            grid.cancelEditData(); // Cancel previous editing state if any

            // Find the column index of ITEM_ID (or ITEM_CODE)
            const columns = grid.getVisibleColumns();
            const itemIdIndex = columns.findIndex(
              (col) => col.dataField === 'ITEM_ID'
            ); // or 'ITEM_CODE'

            if (itemIdIndex !== -1) {
              grid.editRow(0);

              // Delay to ensure editRow() completes before editCell()
              setTimeout(() => {
                grid.editCell(0, itemIdIndex);
              }, 50);
            }
          }
        }
      }, 100); // Let any form reset/focus finish
    }
  }

  // onSexKeyDown(event: any): void {
  //   if (event.event.key === 'Enter') {
  //     setTimeout(() => {
  //       const grid = this.itemsGridRef?.instance;
  //       if (grid) {
  //         // Ensure the grid is ready and data exists
  //         const visibleRows = grid.getVisibleRows();
  //         if (visibleRows.length > 0) {
  //           grid.focus(); // Focus grid first
  //           grid.editRow(0,0); // Start editing the first row
  //           grid.editCell(0, 'ITEM_CODE'); // Then edit the specific cell
  //         }
  //       }
  //     }, 100); // Increased timeout for stability after grid reset
  //   }
  // }

  // onSexKeyDown(event: any): void {
  //   if (event.event.key === 'Enter') {
  //     // Focus on the grid and start editing the ITEM_CODE cell in the first row
  //     setTimeout(() => {
  //       this.itemsGridRef?.instance?.focus();
  //       this.itemsGridRef?.instance?.editCell(0, 'ITEM_CODE');
  //     }, 50);
  //   }
  // }

  onEditorPreparing(e: any): void {
    if (e.parentType === 'dataRow') {
      const rowIndex = e.row.rowIndex;

      // ITEM_ID
      if (e.dataField === 'ITEM_ID') {
        let enterPressedOnce = false;
        const selectedItemIds = this.itemsGridRef.instance
          .getVisibleRows()
          .filter((row) => row.rowIndex !== rowIndex)
          .map((row) => row.data?.ITEM_ID)
          .filter((id) => id !== undefined && id !== null);

        // 👇 Set dynamic dataSource for lookup
        e.editorOptions.dataSource = this.items.filter(
          (item) => !selectedItemIds.includes(item.ID)
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
          // console.log('api called++++++++++++++');
          const selectedId = args.value;
          this.selectedItem = this.items.find(
            (item: any) => item.ID === selectedId
          );
          // console.log('Selected item:', this.selectedItem);

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
          // console.log(this.itemsData,"IS_FIXEDDDDDDDDDDDDD====")
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
                // console.log(maxRows, 'MAXROWS');
                // console.log(this.items, 'ITEMSSSSSS');

                // const currentRows = grid.getVisibleRows().length;
                let currentRows = grid.option('dataSource')?.length ?? 0;
                // console.log(currentRows, 'currentrow');
                // Focus new row (optional)
                if (currentRows < maxRows) {
                  grid.addRow();
                } else {
                  // Optional: show some notification about max rows reached
                  // console.warn('Maximum row limit reached');
                  this.schemaSelect.instance.focus();
                  this.schemaSelect.instance.open();
                }
              }
            }, 50);
          }
          if (key === 'Tab') {
            const grid = this.itemsGridRef?.instance;

            const quantityValue = grid.cellValue(rowIndex, 'QUANTITY');
            const itemIdValue = grid.cellValue(rowIndex, 'ITEM_ID');
            const hasError =
              !itemIdValue ||
              quantityValue == null ||
              quantityValue === '' ||
              isNaN(quantityValue) ||
              quantityValue <= 0;

            if (hasError) {
              event.event.preventDefault();
              event.event.stopPropagation();

              // 🔁 Re-focus the same cell
              grid.editCell(rowIndex, 'QUANTITY');
              console.log('Quantity and Item ID are required.', 'error');
              return;
            }

            // ✅ Only proceed if there's no error
            setTimeout(() => {
              grid.saveEditData();

              const maxRows = this.items.length;
              const currentRows = grid.option('dataSource')?.length ?? 0;

              if (currentRows < maxRows) {
                grid.addRow();
              } else {
                this.schemaSelect.instance.focus();
                this.schemaSelect.instance.open();
              }
            }, 100);
          }

          //           if(key === 'Tab'){

          //                         setTimeout(() => {
          //               const grid = this.itemsGridRef?.instance;

          //               // Ensure QUANTITY is not empty before adding a new row
          //               const quantityValue = grid.cellValue(rowIndex, 'QUANTITY');
          //               const itemIdValue = grid.cellValue(rowIndex, 'ITEM_ID');

          //               if (
          //                 itemIdValue &&
          //                 quantityValue != null &&
          //                 quantityValue !== ''
          //               ) {
          //                 // Optional: commit any changes
          //                 grid.saveEditData();

          //                 // Add a new row
          //                 // grid.addRow();
          // // else {
          //                   // Optional: show some notification about max rows reached
          //                   console.warn('Maximum row limit reached');
          //                   this.schemaSelect.instance.focus();
          //                   this.schemaSelect.instance.open();
          //                 // }
          //               }
          //             }, 100);
          //           }
          if (key === 'ArrowLeft') {
            // event.event.preventDefault(); // Optional: prevent default left arrow behavior
            this.itemsGridRef?.instance?.editCell(rowIndex, 'ITEM_ID');
          }
        };
      }
    }
  }

  onRowRemoving(e: any) {
    // console.log("deletion trigerred")
    const index = this.items.findIndex((item) => item.ID === e.data.ID);
    if (index !== -1) {
      this.items.splice(index, 1); // actually remove it from the array
    }
  }

  convertNumbersToStrings(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertNumbersToStrings(item));
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

  onCellPrepared(e: any) {
    if (
      e.rowType === 'data' &&
      e.column.dataField === 'QUANTITY' &&
      e.cellElement === document.activeElement // focused cell
    ) {
      const quantity = e.data.QUANTITY;
      if (!quantity || isNaN(quantity) || quantity <= 0) {
        e.cellElement.style.backgroundColor = '#ffe6e6';
      } else {
        e.cellElement.style.backgroundColor = '';
      }
    }
  }

  onRowValidating(e: any) {
    // Merge old and new data to get the complete row
    const rowData = { ...e.oldData, ...e.newData };

    const quantity = rowData.QUANTITY;
    const itemId = rowData.ITEM_ID;

    if (!itemId) {
      e.isValid = false;
      e.errorText = 'Item ID is required.';
    } else if (!quantity || isNaN(quantity) || quantity <= 0) {
      e.isValid = false;
      e.errorText = 'Quantity is required';
      this.hasQuantityError = true;
    }
    // else if(!netAmount || isNaN(netAmount) || netAmount <=0){
    //   e.isValid = false;
    //   e.errorText = 'Amount is required';
    // }
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
    const result = this.invoiceFormGroup.instance.validate().isValid;

    if (result) {
      console.log('Form is valid. Submitting data...');
      this.save(); // Your method to handle form submission
    } else {
      console.log('Form has errors. Please correct them.');
    }
  }

  //   @HostListener('document:keydown.enter', ['$event'])
  // handleEnterKey(event: KeyboardEvent) {
  //   event.preventDefault();

  //   if (this.confirmVisible && this.readyToConfirm) {
  //     this.onConfirm(true);
  //   } else if (this.printConfirmVisible) {
  //     this.onConfirmPrint(true);
  //     // this.printConfirmVisible = false;
  //   }
  // }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    event.preventDefault();

    if (this.confirmVisible && this.readyToConfirm) {
      this.onConfirm(true);
    } else if (this.printConfirmVisible) {
      const activeElementId = document.activeElement?.id;

      switch (activeElementId) {
        case 'btn-no':
          this.onConfirmPrint('no');
          break;
        case 'btn-yes':
          this.onConfirmPrint('Print & Preview');
          break;
        case 'btn-print':
          this.onConfirmPrint('print');
          break;
        default:
          // fallback if none is focused
          this.onConfirmPrint('Print & Preview');
      }
    }
  }

  focusYesButton() {
    setTimeout(() => {
      this.yesButton?.instance?.focus();
    });
  }

  handleRightArrow(event: any) {
    if (event.event.key === 'ArrowRight') {
      event.event.preventDefault();
      this.noButton?.instance?.focus();
    }
  }

  save() {
    if (
      !this.invoiceFormData.NET_AMOUNT ||
      +this.invoiceFormData.NET_AMOUNT === 0
    ) {
      notify({
        message: 'Quantity or Net amount is 0',
        type: 'error',
        displayTime: 3000,
        position: { at: 'top center', my: 'top center' },
      });
      return;
    }
    const clonedData = { ...this.invoiceFormData };
    const invoiceEntries = clonedData.INVOICE_ENTRY || [];
    const entries = clonedData.INVOICE_ENTRY || [];

    const invalidEntry = entries.find(
      (entry) =>
        entry.ITEM_ID &&
        (!entry.QUANTITY ||
          isNaN(entry.QUANTITY) ||
          +entry.QUANTITY <= 0 ||
          !(entry.PRICE ?? entry.UNIT_PRICE))
    );

    if (invalidEntry) {
      notify({
        message:
          'Each item with an Item ID must have a valid Quantity and Price.',
        type: 'error',
        displayTime: 3000,
        position: { at: 'top center', my: 'top center' },
      });
      return; // stop execution
    }
    clonedData.INVOICE_ENTRY = (clonedData.INVOICE_ENTRY || [])
      .filter(
        (entry) =>
          entry.ITEM_ID && entry.QUANTITY && (entry.PRICE ?? entry.UNIT_PRICE)
      )
      .map((entry) => ({
        ITEM_ID: entry.ITEM_ID,
        QUANTITY: entry.QUANTITY,
        UNIT_PRICE: entry.PRICE ?? entry.UNIT_PRICE,
        AMOUNT: (+entry.QUANTITY * +(entry.PRICE ?? entry.UNIT_PRICE)).toFixed(
          2
        ),
      }));

    // Format the date

    clonedData.INVOICE_DATE = new Date().toISOString();

    // Convert numbers to strings
    const dataToSave = this.convertNumbersToStrings(clonedData);

    // Save to backend
    this.dataService.saveInvoiceData(dataToSave).subscribe((response: any) => {
      // console.log(response, 'SAVE');
      if (response.flag == '1') {
        this.printData = response.data;
        console.log(this.printData, 'PRINTDATAAAAAAAAAAAA');
        notify(
          {
            message: 'Invoice Entered Successfully',
            position: { at: 'top center', my: 'top center' },
          },
          'success'
        );
        this.printConfirmVisible = true;
      } else {
        notify(
          {
            message: 'Invoice Not Generated',
            position: { at: 'top right', my: 'top right' },
          },
          'error'
        );
      }
    });
    this.resetInvoiceForm();
    // this.printInvoice();
  }

  onConfirmPrint(action: 'Print & Preview' | 'no' | 'print') {
    this.printConfirmVisible = false; // close popup

    if (action === 'Print & Preview') {
      this.previewAndPrintInvoice(this.printData);
    } else if (action === 'print') {
      this.onPrintDirectly();
    } else if (action === 'no') {
      notify('Print cancelled', 'warning', 2000);
    }
  }

  // onEnterKey(event: Event) {
  //   const keyboardEvent = event as KeyboardEvent;
  //   const activeElement = document.activeElement as HTMLElement;

  //   const buttonText = activeElement?.textContent?.trim();

  //   if (buttonText === 'Print') {
  //     this.onPrintDirectly();
  //   } else if (buttonText === 'Yes') {
  //     this.onConfirmPrint(true);
  //   } else if (buttonText === 'No') {
  //     this.onConfirmPrint(false);
  //   }
  // }

  resetInvoiceForm() {
    this.invoiceFormData = {
      INVOICE_NO: '',
      INVOICE_DATE: new Date().toISOString(),
      DEPARTMENT_ID: '1',
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

    this.formattedInvoiceDate = this.getFormattedDateTime(new Date());
    this.getInvoiceNo();
    this.invoiceFormGroup.instance.reset();

    // Focus on ward field
    setTimeout(() => {
      this.wardBoxRef?.instance?.focus();
    }, 100);
  }

  cancel() {
    // Reset form
    this.invoiceFormData = {
      PATIENT_NAME: '',
      UHID: '',
      PATIENT_AGE: '',
      INVOICE_DATE: new Date().toISOString(),
      PATIENT_MOBILE: '',
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

  ageNotZero = (e: any) => {
    const value = e.value;
    return value !== 0 && value !== '0'; // ensure age is not zero (number or string)
  };

  previewAndPrintInvoice(data: any) {
    const printWindow = window.open('', '_blank', 'width=800,height=700');
    const htmlContent = `
    <html>
      <head>
        <title>Hospital Bill</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            font-size: 14px;
            color: #000;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h2 {
            margin: 0;
            font-size: 22px;
          }
          .header h4 {
            margin: 0;
            font-weight: normal;
            font-size: 16px;
          }
          .info-table {
            width: 100%;
            margin-bottom: 20px;
          }
          .info-table td {
            padding: 6px 10px;
            vertical-align: top;
          }
          .info-table .label {
            font-weight: bold;
            white-space: nowrap;
          }
          .section-title {
            font-weight: bold;
            margin: 20px 0 10px 0;
            text-decoration: underline;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
          }
          .invoice-table th, .invoice-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          .invoice-table th.numeric, .invoice-table td.numeric {
            text-align: right;
            font-variant-numeric: tabular-nums;
            font-family: 'Courier New', Courier, monospace;
          }
          .totals {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
          }
          .totals td {
            padding: 4px 8px;
            text-align: right;
            font-variant-numeric: tabular-nums;
            font-family: 'Courier New', Courier, monospace;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">

        <div class="header">
          <h2>DEPARTMENT OF ${data.DEPARTMENT || 'HOSPITAL'}</h2>
          <h4>MEDICAL COLLEGE, KOZHIKODE</h4>
        </div>

        <table class="info-table">
          <tr>
            <td><span class="label">Name:</span> ${data.PATIENT_NAME}</td>
            <td><span class="label">Age:</span> ${
              data.PATIENT_AGE
            } <span class="label">Sex:</span>${data.PATIENT_SEX}</td>
            <td><span class="label">Date:</span> ${data.INVOICE_DATE}</td>
            
          </tr>
          <tr>
          <td><span class="label">UHID:</span> ${data.UHID}</td>
          
          <td><span class="label">Mobile:</span> ${data.PATIENT_MOBILE}</td>
         
          </tr>
          <tr>
          <td><span class="label">Hospital:</span> MCH KOZHIKODE</td>
          <td><span class="label">Invoice No.:</span> ${data.INVOICE_NO}</td>
          </tr>
        </table>

        <div class="section-title">Invoice Items</div>
        <table class="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item ID</th>
              <th class="numeric">Quantity</th>
              <th class="numeric">Unit Price (₹)</th>
              <th class="numeric">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${data.INVOICE_ENTRY.map(
              (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.ITEM_NAME}</td>
                <td class="numeric">${item.QUANTITY}</td>
                <td class="numeric">${item.UNIT_PRICE}</td>
                <td class="numeric">${item.AMOUNT}</td>
              </tr>`
            ).join('')}
          </tbody>
        </table>

        <table class="totals">
          <tr><td><strong>Gross Amount:</strong> ₹${data.GROSS_AMOUNT}</td></tr>
          <tr><td><strong>Discount (${data.SCHEMA_NAME}):</strong> ₹${
      data.SCHEMA_AMOUNT
    }</td></tr>
          <tr><td><strong>Net Amount:</strong> ₹${data.NET_AMOUNT}</td></tr>
        </table>
      </body>
    </html>
  `;

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  }

  onPrintDirectly() {
    console.log('ONLY PRINT NO PREVIEW');
    window.print();
  }

  preventNonNumeric(event: any): void {
    const input = event.event?.target as HTMLInputElement;
    if (input) {
      input.value = input.value.replace(/[^0-9]/g, '');
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
    DxValidationGroupModule,
    DxAutocompleteModule,
  ],
  providers: [],
  declarations: [InvoiceAddComponent],
  exports: [InvoiceAddComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvoiceAddModule {}
