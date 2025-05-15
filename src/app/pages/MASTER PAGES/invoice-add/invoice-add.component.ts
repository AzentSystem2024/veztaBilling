import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
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
} from 'devextreme-angular';
import {
  DxoItemModule,
  DxoFormItemModule,
  DxoLookupModule,
  DxiItemModule,
  DxiGroupModule,
} from 'devextreme-angular/ui/nested';
import { FormTextboxModule } from 'src/app/components';
// import { UserAddComponent } from '../userFiles/user-add/user-add.component';

@Component({
  selector: 'app-invoice-add',
  templateUrl: './invoice-add.component.html',
  styleUrls: ['./invoice-add.component.scss'],
})
export class InvoiceAddComponent {
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
  insuranceOptions = [
    { id: 1, name: 'Insurance A' },
    { id: 2, name: 'Insurance B' },
    // your insurance options here
  ];

  invoice = [
    {
      ITEM_CODE: 'ITM001',
      DESCRIPTION: '',
      QUANTITY: '',
      UOM: '',
      UNIT_PRICE: '',
      TOTAL: ''
    },
  ];

  paymentModes = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit' },
  ];
  schemaOptions = [
    { id: 1, name: 'Schema A' },
    { id: 2, name: 'Schema B' },
    { id: 3, name: 'Schema C' },
  ];
  itemCodeOptions = [
    { id: 'ITM001', name: 'Item 001' },
    { id: 'ITM002', name: 'Item 002' },
    { id: 'ITM003', name: 'Item 003' },
  ];
  sexOptions = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' },
  ];
  constructor() {}

  ngOnInit() {}

  customFormat(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
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
