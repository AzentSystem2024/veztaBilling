import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxCheckBoxModule,
  DxPopupModule,
  DxDataGridComponent,
  DxDateBoxModule,
  DxTemplateModule,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import {
  UserListComponent,
  UserListModule,
} from '../../userFiles/user-list/user-list.component';
// import { UserAddModule } from '../../userFiles/user-add/user-add.component';
// import { UserListComponent } from '../../userFiles/user-list/user-list.component';
import { InvoiceAddModule } from '../../invoice-add/invoice-add.component';
import { DataService } from 'src/app/services';
import { InvoiceViewModule } from '../invoice-view/invoice-view.component';
import { InvoiceListUpdateService } from 'src/app/services/invoice-list-update.service';
import { FilterRow } from 'devextreme/common/grids';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showHeaderFilter: true;
  showFilterRow = true;
  isFilterOpened = false;
  GridSource: any;
  isLoading: boolean = false;
  filterRowVisible: boolean = false;
Department: any = {};
loggedInUser : any = {}
  dateTimeFormat = {
    type: 'datetime',
    format: 'dd-MM-yyyy hh:mm tt',
  };
  isEditPopupVisible = false;
  selectedInvoice: any = null;

  addInvoicePopupOpened: boolean = false;
  invoiceList: any;
  ID: any;
  storedUserData: string;
  userData: any;
  USER: any;
  dateRanges = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'Last 15 Days', value: 'last15' },
  { label: 'Last 30 Days', value: 'last30' },
  { label: 'Custom', value: 'custom' }
];
showCustomDatePopup = false;
customStartDate: any = null;
customEndDate: any = null;
filteredInvoiceList: any[] = [];
selectedDateRange: string = 'today'; 
toolbarItems: any[] = [];
filterRowOptions: FilterRow = {
  visible: true,
  applyFilter: 'auto' as 'auto' | 'onClick' // Cast explicitly to the correct type
};
isFilterRowVisible: boolean = false;
auto: string = 'auto';

filterButtonOptions: any = {
  icon: 'filter',
  hint: 'Show Filter Row',
  onClick: () => this.toggleFilterRow(),
  stylingMode: 'text',
  elementAttr: { class: 'commonButtons' }
};

  constructor(private dataService: DataService,
    private invoiceUpdateService: InvoiceListUpdateService
  ) {}

  ngOnInit() {
    
    this.storedUserData = sessionStorage.getItem('savedUserData');
    // console.log(this.storedUserData, 'STOREDUSERDATA');
    if (this.storedUserData) {
      this.userData = JSON.parse(this.storedUserData);
      // console.log('User Data in INVOICELIST:', this.userData);
      this.USER = this.userData.USER_TYPE_NAME;
      this.Department.DEPARTMENT_ID = this.userData.DEPARTMENT_ID;
      this.loggedInUser.USER_ID = this.userData.USER_ID
    }

    this.getInvoiceList();
  this.invoiceUpdateService.update$.subscribe(() => {
    // console.log('New invoice added — refreshing list...');
    this.getInvoiceList();
  });
  }

  getInvoiceList() {
    const department = this.Department;
    this.dataService.getInvoiceList(this.loggedInUser).subscribe((response: any) => {
      this.invoiceList = response.data;

      // console.log(response, 'INVOICELIST');
      this.applyDateFilter();
    });
  }

calculateSummary(e: any) {
  if (e.name === 'AdjustedNetAmount') {
    if (e.summaryProcess === 'start') {
      e.totalValue = 0;
    }

    if (e.summaryProcess === 'calculate') {
      const row = e.value;

      // Parse NET_AMOUNT as float
      const amount = parseFloat(row?.NET_AMOUNT ?? '0');

      // Normalize status to lowercase for comparison
      const status = (row?.STATUS ?? '').toLowerCase();

      // Debug print
      console.log('Row:', row, 'Amount:', amount, 'Status:', status);

      if (!isNaN(amount) && status !== 'cancelled') {
        e.totalValue += amount;
      }
    }

    if (e.summaryProcess === 'finalize') {
      console.log('Final totalValue:', e.totalValue);
      e.totalValue = Number(e.totalValue.toFixed(2));
    }
  }
}








 toggleFilterRow = () => {
    this.isFilterRowVisible = !this.isFilterRowVisible;
  };
  applyDateFilter() {
  if (!this.selectedDateRange || !this.invoiceList) {
    this.filteredInvoiceList = this.invoiceList;
        if (this.dataGrid?.instance) {
      this.dataGrid.instance.refresh();
    }
    return;
  }

  const today = new Date();
  let startDate: Date;

  switch (this.selectedDateRange) {
    case 'today':
      startDate = new Date(today.setHours(0, 0, 0, 0));
      break;
    case 'last7':
      startDate = new Date(today.setDate(today.getDate() - 6));
      break;
    case 'last15':
      startDate = new Date(today.setDate(today.getDate() - 14));
      break;
    case 'last30':
      startDate = new Date(today.setDate(today.getDate() - 29));
      break;
    default:
      this.filteredInvoiceList = this.invoiceList;
      return;
      
  }

  this.filteredInvoiceList = this.invoiceList.filter((item: any) => {
    const invoiceDateParts = item.INVOICE_DATE.split('-'); // Assuming format "DD-MM-YYYY"
    const invoiceDate = new Date(
      parseInt(invoiceDateParts[2]),
      parseInt(invoiceDateParts[1]) - 1,
      parseInt(invoiceDateParts[0])
    );
    return invoiceDate >= startDate;
  });
}

onDateRangeChanged(e: any) {
  this.selectedDateRange = e.value;

  if (e.value === 'custom') {
    this.customStartDate = null;
    this.customEndDate = null;
    this.showCustomDatePopup = true;
  } else {
    // Reset the custom label
    const customOpt = this.dateRanges.find(dr => dr.value === 'custom');
    if (customOpt) {
      customOpt.label = 'Custom';
    }
    this.applyDateFilter();
  }
}



applyCustomDateFilter() {
  if (!(this.customStartDate && this.customEndDate)) {
    return;
  }

  // 1) Force your customStartDate to midnight (00:00:00.000)
  const start = new Date(this.customStartDate);
  start.setHours(0,  0,  0,  0);

  // 2) Force your customEndDate to the end of the day (23:59:59.999)
  const end = new Date(this.customEndDate);
  end.setHours(23, 59, 59, 999);

  // 3) Filter invoiceList—BUT first strip off the time in the invoice’s string:
  this.filteredInvoiceList = this.invoiceList.filter((item: any) => {
    // “item.INVOICE_DATE” is something like "28-05-2025 13:33:33"
    // We only want the “28-05-2025” part. So split on the space and take [0].
    const dateOnlyStr = item.INVOICE_DATE.split(' ')[0];  // = "28-05-2025"

    // Now split that by “-” into [ "28", "05", "2025" ]
    const [day, month, year] = dateOnlyStr.split('-').map(Number);

    // Create a JS Date at midnight of that day:
    const invoiceDate = new Date(year, month - 1, day);

    // Finally, check if it falls between our start (00:00) and end (23:59:59.999).
    return invoiceDate >= start && invoiceDate <= end;
  });
  const fromLabel = this.formatAsDDMMYYYY(start);
  const toLabel = this.formatAsDDMMYYYY(end);
  this.dateRanges = this.dateRanges.map(option =>
    option.value === 'custom' ? { ...option, label: `${fromLabel} to ${toLabel}` } : option
  );
  // 4) Close the popup so the select‐box shows whatever label you’ve set for “Custom”
  this.showCustomDatePopup = false;
}

displayExpr = (item: any) => {
  if (!item) return '';

  if (
    item.value === 'custom' &&
    this.customStartDate &&
    this.customEndDate
  ) {
    const from = this.formatAsDDMMYYYY(new Date(this.customStartDate));
    const to = this.formatAsDDMMYYYY(new Date(this.customEndDate));
    return `${from} to ${to}`;
  }

  return item.label;
};



attachItemClickHandler(e: any) {
  setTimeout(() => {
    const popup = e.component._popup;  
    const innerList = popup && popup.$content().find('.dx-list').dxList('instance');
    if (innerList) {
      innerList.off('itemClick');            // unsubscribe first (to avoid duplicates)
      innerList.on('itemClick', (clickEvent: any) => {
        const clickedValue = clickEvent.itemData.value;
        if (clickedValue === 'custom') {
          this.openCustomDatePopup();
          e.component.close();
        }
      });
    }
  }, 0);
}

openCustomDatePopup() {
  this.customStartDate = null;
  this.customEndDate   = null;
  this.showCustomDatePopup = true;
}

private formatAsDDMMYYYY(d: Date): string {
  const day   = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year  = d.getFullYear();
  return `${day}-${month}-${year}`;
}

get customStartDateFormatted(): string {
  return this.customStartDate ? this.formatAsDDMMYYYY(new Date(this.customStartDate)) : '';
}

get customEndDateFormatted(): string {
  return this.customEndDate ? this.formatAsDDMMYYYY(new Date(this.customEndDate)) : '';
}


  formatDate(value: string | Date): string {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}.${minutes}`;
  }









  addInvoice() {
    this.addInvoicePopupOpened = true;
  }

  handleClose() {
    this.isEditPopupVisible = false; // **Important**: hide the popup
    this.addInvoicePopupOpened = false; // if this is related, keep it
    this.getInvoiceList(); // reload list or any other action
  }

  onViewClick(e: any) {
    console.log('POPUP OPENED');
    this.ID = e.row?.data.ID;
    console.log(this.ID, 'ID');
    this.dataService.selectInvoice(this.ID).subscribe((response: any) => {
      this.selectedInvoice = response;
      console.log(this.selectedInvoice, 'SELECTEDINVOICE');
    });
    this.isEditPopupVisible = true;
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxLookupModule,
    DxButtonModule,
    FormPopupModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxPopupModule,
DxDateBoxModule,
    UserListModule,
    InvoiceAddModule,
    InvoiceViewModule,
    DxTemplateModule
  ],
  providers: [],
  exports: [InvoiceListComponent],
  declarations: [InvoiceListComponent],
})
export class InvoiceListModule {}
