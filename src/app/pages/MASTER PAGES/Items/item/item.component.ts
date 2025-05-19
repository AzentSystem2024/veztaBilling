import { Component, NgModule } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { ValidatorFn, AbstractControl } from '@angular/forms';
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
  department_list: any
 select_option = [
  { text: 'Fixed', value: true },
  { text: 'Variable', value: false }
];



constructor(private dataservice:DataService,private fb:FormBuilder){
  this.formsource=this.fb.group({
    code:[''],
    item_name:[''],
    is_fixed:[''],
    price:[0],
    department_id:[''],
    status:[''] 
 })


  this.department_dropdown_list()

}



openPopup(){
this.isAddPop=true
}

delete_Items_Data(event:any){

}


onExporting(event:any){

}

onEditingStart(event:any){
event.cancel=true
this.isEditPop=true
}

closePopup(){
  this.isAddPop=false
  this.isEditPop=false

}
minValue = 0; // default min value



ngOnInit() {
  // When is_fixed changes, update validators on price
  this.formsource.get('is_fixed')?.valueChanges.subscribe((isFixed: boolean) => {
    const priceControl = this.formsource.get('price');

    if (isFixed) {
      // Apply required + custom validator (price > 0)
      priceControl?.setValidators([this.priceGreaterThanZeroValidator()]);
    } else {
      // Clear validators when is_fixed is false
      priceControl?.clearValidators();
    }

    priceControl?.updateValueAndValidity();
  });
}

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


addData(){
  console.log('===========ad data=======');
  
  console.log(this.formsource);
  
  

}
update_item_Data(){

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
