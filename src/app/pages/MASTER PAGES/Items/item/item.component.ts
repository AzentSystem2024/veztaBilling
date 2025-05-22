import { Component, NgModule } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import notify from 'devextreme/ui/notify';
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
  DxTagBoxModule,
} from 'devextreme-angular';

import {
  DxoItemModule,
  DxoFormItemModule,
  DxoLookupModule,
  DxiItemModule,
  DxiGroupModule,
} from 'devextreme-angular/ui/nested';

import { FormTextboxModule } from 'src/app/components';
import { DataService } from 'src/app/services';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {

items_source:any
isAddPop:boolean=false
isEditPop:boolean=false
formsource:FormGroup
  department_list: any=[]
 select_option = [
  { text: 'Fixed', value: true },
  { text: 'Variable', value: false }
];
  items_data: any=[]
  selected_data: any=[]
  code_value:any
  department_id_value: any
  is_inactve_value: any;
  is_fixed_value: boolean;
  name_value: any;
  price_value: any;



constructor(private dataservice:DataService,private fb:FormBuilder){
  this.formsource=this.fb.group({
    code:[''],
    item_name:[''],
    is_fixed:[''],
    price:[0],
    department_id:[''],
    IS_INACTIVE:[false] 
 })


  this.department_dropdown_list()
  this.items_list()

}



openPopup(){
this.isAddPop=true
this.formsource.reset({
  IS_INACTIVE: false,
 
})

}

delete_Items_Data(event:any){


  const id=event.data.ID


  this.dataservice.delete_items_api(id).subscribe((Res:any)=>{
    console.log(Res);
     notify(
            {
              message: 'Item deleted successfully',
              position: { at: 'top right', my: 'top right' },
              displayTime: 500,
            },
            'success'
          );
})

}



onEditingStart(event:any){
event.cancel=true
this.isEditPop=true
console.log(event)
this.select_list_data(event)
}

closePopup(){
  this.isAddPop=false
  this.isEditPop=false
  this.formsource.reset()
   this.formsource.reset({
    IS_INACTIVE: false,
   })

}
minValue = 0; // default min value




// ngOnInit() {
//   // When is_fixed changes, update validators on price
//   this.formsource.get('is_fixed')?.valueChanges.subscribe((isFixed: boolean) => {
//     const priceControl = this.formsource.get('price');

//     if (isFixed) {
//       // Apply required + custom validator (price > 0)
//       priceControl?.setValidators([this.priceGreaterThanZeroValidator()]);
//     } else {
//       // Clear validators when is_fixed is false
//       priceControl?.clearValidators();
//     }

//     priceControl?.updateValueAndValidity();
//   });
// }

// Custom validator: price must be > 0
priceGreaterThanZeroValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (value == null || value <= 0) {
      return { priceInvalid: true };
    }
    return null;
  };
}


// Custom validator to enforce price > 0 if is_fixed is true
validatePrice = (e: any): boolean => {
  const isFixed = this.formsource.get('is_fixed')?.value;
  const price = e.value;

  if (isFixed) {
    return price > 0;
  }
  return true;
};


department_dropdown_list(){
  this.dataservice.get_dropdown_department_api(name).subscribe((res:any)=>{
    console.log(res);
    
   this.department_list=res
   
  })
}

items_list() {
  this.dataservice.get_ItemsData_List().subscribe((res: any) => {
    console.log(res, '===========items list');
    
    // Add SlNo to each item
    this.items_data = res.Data.map((item: any, index: number) => ({
      ...item,
      SlNo: index + 1
    }));

    this.items_source = this.items_data;
  });
}


addData() {
  console.log('===========ad data=======');
  
  console.log(this.formsource);

  // Check if required fields are filled
  if (!this.formsource.value.code || !this.formsource.value.item_name || !this.formsource.value.department_id || this.formsource.value.is_fixed === null) {
    let errorMessage = 'Please fill all required fields: ';
    const missingFields = [];
    
    if (!this.formsource.value.code) missingFields.push('Item Code');
    if (!this.formsource.value.item_name) missingFields.push('Item Name');
    if (!this.formsource.value.department_id) missingFields.push('Department');
     if ( this.formsource.value.is_fixed === null) missingFields.push('please select fixed or variable');
    
    errorMessage += missingFields.join(', ');

    notify(
      {
        message: errorMessage,
        position: { at: 'top right', my: 'top right' },
        displayTime: 3000,
      },
      'error'
    );
    return;
  }

  const is_fixed = this.formsource.value.is_fixed;
 let item_price = this.formsource.value.price;

if (is_fixed === true) {
    if (item_price == null || item_price === '' || item_price <= 1) {
      notify(
        {
          message: 'Fixed items must have a price greater than 1',
          position: { at: 'top right', my: 'top right' },
          displayTime: 3000,
        },
        'error'
      );
      return;
    }
  } else {
    // For variable items, set null/empty price to 0
    if (item_price == null || item_price === '') {
      item_price = 0;
    }
  }

  const item_code = this.formsource.value.code.toString();
  const name = this.formsource.value.item_name;
  const is_inactive = this.formsource.value.IS_INACTIVE;
  const dep_id = this.formsource.value.department_id.join(',');

  const codeDuplicate = this.items_source?.some((item: any) => 
    (item.ITEM_CODE?.trim().toLowerCase() || '') === (item_code?.trim().toLowerCase() || '')
  );

  const nameDuplicate = this.items_source?.some((item: any) => 
    (item.ITEM_NAME?.trim().toLowerCase() || '') === (name?.trim().toLowerCase() || '')
  );

  if (codeDuplicate || nameDuplicate) {
    console.log('Duplication Checking Triggered');
    
    let errorMessage = '';
    if (codeDuplicate && nameDuplicate) {
      errorMessage = 'Item code and name both already exist!';
    } else if (codeDuplicate) {
      errorMessage = 'Item code already exists!';
    } else {
      errorMessage = 'Item name already exists!';
    }

    notify(
      {
        message: errorMessage,
        position: { at: 'top right', my: 'top right' },
        displayTime: 3000,
      },
      'error'
    );
    return;
  }

  this.dataservice.add_items_api(item_code, name, is_fixed, item_price, is_inactive, dep_id).subscribe((res: any) => {
    console.log(res, '===========added responsee===========');
    
    notify(
      {
        message: 'Items Added successfully',
        position: { at: 'top right', my: 'top right' },
        displayTime: 500,
      },
      'success'
    );
    this.items_list();
    this.isAddPop = false;
  });
}


select_list_data(event:any){
const id = event.data.ID
  this.dataservice.select_items_Data(id).subscribe((res:any)=>{
    console.log(res,'selected data')
    this.selected_data=res.Data
this.code_value=this.selected_data.ITEM_CODE

this.name_value=this.selected_data.ITEM_NAME
this.price_value=this.selected_data.PRICE


  this.department_id_value = this.selected_data.DEPARTMENT_ID.split(',').map(id => +id);
  this.is_fixed_value=this.selected_data.IS_FIXED_PRICE
  this.is_inactve_value=this.selected_data.IS_INACTIVE
  console.log(this.is_inactve_value);
  

  })
}
formatAsPercentage(value: any): string {
  if (value == null || value === '') return '';
  return `${Number(value).toLocaleString()}%`;
}


getStatusFlagClass(IS_INACTIVE: boolean): string {
  return IS_INACTIVE ? 'flag-red' : 'flag-green';
}

 //=================
update_item_Data(){
   if (!this.code_value|| !this.name_value || this.department_id_value==0|| this.is_fixed_value === null) {
    let errorMessage = 'Please fill all required fields: ';
    const missingFields = [];
    
    if (!this.code_value) missingFields.push('Item Code');
    if (!this.name_value ) missingFields.push('Item Name');
    if (this.department_id_value==0) missingFields.push('Department');
     if ( this.is_fixed_value=== null) missingFields.push('please select fixed or variable');
    
    errorMessage += missingFields.join(', ');

    notify(
      {
        message: errorMessage,
        position: { at: 'top right', my: 'top right' },
        displayTime: 3000,
      },
      'error'
    );
    return;
  }

//   const is_fixed = this.formsource.value.is_fixed;
//  let item_price = this.formsource.value.price;
const is_fixed = this.is_fixed_value
let item_price = this.price_value
if (is_fixed === true) {
    if (item_price == null || item_price === '' || item_price <= 1) {
      notify(
        {
          message: 'Fixed items must have a price greater than 1',
          position: { at: 'top right', my: 'top right' },
          displayTime: 3000,
        },
        'error'
      );
      return;
    }
  } else {
    // For variable items, set null/empty price to 0
    if (item_price == null || item_price === '') {
      item_price = 0;
    }
  }

const id=this.selected_data.ID

const item_code=this.code_value.toString();
const name=this.name_value
const is_inactive=this.is_inactve_value
const dep_id = this.department_id_value.join(',');
const codeDuplicate = this.items_source?.some((item: any) => {
    if (item.ID === id) return false; // Skip current item when editing
    return (item.ITEM_CODE?.trim().toLowerCase() || '') === (item_code?.trim().toLowerCase() || '');
  });

  const nameDuplicate = this.items_source?.some((item: any) => {
    if (item.ID === id) return false; // Skip current item when editing
    return (item.ITEM_NAME?.trim().toLowerCase() || '') === (name?.trim().toLowerCase() || '');
  });
if (codeDuplicate || nameDuplicate) {
  console.log('Duplication Checking Triggered');
  
  let errorMessage = '';
  if (codeDuplicate && nameDuplicate) {
    errorMessage = 'Item code and name both already exist!';
  } else if (codeDuplicate) {
    errorMessage = 'Item code already exists!';
  } else {
    errorMessage = 'Item name already exists!';
  }

  notify(
    {
      message: errorMessage,
      position: { at: 'top right', my: 'top right' },
      displayTime: 3000, // Increased display time for better readability
    },
    'error'
  );
  return;
}

  this.dataservice.update_items_Api(id,item_code,name,is_fixed,item_price,is_inactive,dep_id).subscribe((res:any)=>{
    console.log(res,'=========update========');
    
          notify(
            {
              message: 'Item Updated successfully',
              position: { at: 'top right', my: 'top right' },
              displayTime: 500,
            },
            'success'
          );
   this.items_list()
   this.isEditPop=false
    
  })

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
    DxNumberBoxModule,
    ReactiveFormsModule,
    DxTagBoxModule,



  ],
  providers: [],
  declarations: [ItemComponent],
  exports: [ItemComponent],
})
export class ItemModule {}
