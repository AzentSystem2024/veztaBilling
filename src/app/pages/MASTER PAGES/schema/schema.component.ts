import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxValidatorModule } from 'devextreme-angular';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { EditingStartEvent } from 'devextreme/ui/data_grid';
import notify from 'devextreme/ui/notify';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent { 

  dataSource: any = [];

  PopupWidth = 400;
  addPopup: boolean = false;
  editPopup: boolean = false;
  formsource: any;
  editSchemaData: any;
showFilterRow: boolean = true;
currentFilter: string = 'auto';
Status: boolean;
IS_INACTIVE: boolean = false;
  selectedData: any;

  constructor(private fb:FormBuilder ,private dataservice: DataService) {
   this.formsource=this.fb.group({
    Id: [null],
    Schema:["",[Validators.required]],
    Discount: [null,[Validators.required, Validators.min(0), Validators.max(100)]], // Initialize with null or a default value
    Inactive:[false,[Validators.required]]
   })

 this.get_Schema_List()
}

getStatusFlagClass(IS_INACTIVE: boolean): string {
  return IS_INACTIVE ? 'flag-red' : 'flag-green';
}

//=====PERCENTAGE FORMAT=====//
formatAsPercentage(value: any): string {
  if (value == null || value === '') return '';
  return `${Number(value).toLocaleString()}%`;
}




statusCellTemplate = (cellElement: any, cellInfo: any) => {
  const status = cellInfo.value; // Get the value from `calculateCellValue`

  // Determine background color and display text based on the status
  const color = status === 'Inactive' ? 'red' : 'green';
  const text = status; // Use the calculated value ("Inactive" or "Active")

  // Apply the dynamic styles and content
  cellElement.innerHTML = `
    <span style="
      background-color: ${color};
      color: white;
      padding: 2px 3px;
      border-radius: 5px;
      display: inline-block;
      text-align: center;
      min-width: 60px;"
    >
      ${text}
    </span>`;
};

onExporting(event: any) {

}
  
onDiscountChange(event: any) {
  this.formsource.get('Discount').setValue(event.value);
}


openPopup(){
  this.addPopup = true;
  this.formsource.reset({
    Inactive: ""
  });
}


  closePop(){
    this.addPopup=false;
  this.editPopup=false;
this.formsource.reset()
  this.formsource.reset({
    
  });
  console.log(this.formsource,'reset');
  
  }
onEditingStart(event: any) {
  event.cancel=true;
    this.editSchemaData=event.data;
    this.editPopup=true;

    this.select_Schema_Data(event);
}

 deleteData(event:any){
const ID = event.data.ID

if(ID){
  this.dataservice.Delete_Schema_Api(ID).subscribe((response:any)=>{
    console.log(response,'delete response');
    notify(
      {
        message: 'Data succesfully deleted',
        position: { at: 'top right', my: 'top right' },
        displayTime: 500,
      },
      'success'
    );
   })
 }

}

 get_Schema_List(){
  console.log('get_Schema_List');
  
this.dataservice.get_SchemaData_List().subscribe((response:any)=>{
  console.log('get_Schema_List',response);

  if(response){
    this.dataSource = response.Data.map((item:any, index:any) => ({
      ...item,
      "SlNo": index + 1, // Assign serial number
    }));
    // console.log(response.data);
  }
})
}


addData(){

  const Schema = this.formsource.value.Schema
  const Discount = this.formsource.value.Discount
  const Inactive =this.formsource.value.Inactive

  if (!Schema || !Discount) {
    notify(
      {
        message: 'Please fill the field.',
        position: { at: 'top right', my: 'top right' },
        displayTime: 1000,
      },
      'error'
    );
    return; // Stop further execution
  }

  // Check if Discount is out of valid range
    if (Discount < 0 || Discount > 100) {
      notify(
        {
          message: 'The discount must be between 0 and 100',
          position: { at: 'top right', my: 'top right' },
          displayTime: 500,
        },
        'error'
      );
      return; // Prevent saving
    }

  // Convert Inactive to boolean
  const isInactiveBoolean = Inactive === 'true' || Inactive === true;
  
const isDuplicate = this.dataSource.some((data:any)=>{
return data.SCHEMA_NAME.toLowerCase() === Schema.toLowerCase() 
})
 if(isDuplicate){
    notify(
      {
        message: 'Schema already exists',
        position: { at: 'top right', my: 'top right' },
        displayTime: 500,
      },
      'error'
    );
    return;
 }

    if(Schema){
      console.log("function called");
      
      this.dataservice.Insert_SchemaData_Api(Schema,Discount,isInactiveBoolean).subscribe((response:any)=>{
        console.log(response,'add response');
        
      notify(
        {
          message: 'Data succesfully added',
          position: { at: 'top right', my: 'top right' },
          displayTime: 500,
        },
        'success'
      );
      this.addPopup=false;
      this.get_Schema_List()
    })
  } 
}
editData(){
const ID = this.formsource.value.Id
const Schema = this.formsource.value.Schema
const Discount = this.formsource.value.Discount
const Inactive =this.formsource.value.Inactive

if (!Schema || !Discount) {
    notify(
      {
        message: 'Please fill the field.',
        position: { at: 'top right', my: 'top right' },
        displayTime: 1000,
      },
      'error'
    );
    return; // Stop further execution
  }

const isDuplicate = this.dataSource.some((data:any)=>{
  return data.SCHEMA_NAME.toLowerCase() === Schema.toLowerCase()  && data.ID !== ID //Exclude the current hospital
 });
   if(isDuplicate){
    this.get_Schema_List()
      notify(
        {
          message: 'Data already exists',
          position: { at: 'top right', my: 'top right' },
          displayTime: 500,
        },
        'error'
      );
      return;
   
   }
   
if(Schema && Discount){
this.dataservice.Update_SchemaData_Api(ID,Schema,Discount,Inactive).subscribe((response:any)=>{
  notify(
    {
      message: 'Data succesfully added',
      position: { at: 'top right', my: 'top right' },
      displayTime: 500,
    },
    'success'
  );
  this.editPopup=false
  this.get_Schema_List()
 
});
this.get_Schema_List()
} 

}

 select_Schema_Data(e:any){
  console.log(e);
  const ID = e.data.ID;
  this.dataservice.Select_SchemaData_Api(ID).subscribe((res:any)=>{
    console.log(res,"result");
    // this.select_Data = res;
    // this.updatedHospitalData = {...res};
    this.formsource.patchValue({
  Id: res.Data.ID,
  Schema: res.Data.SCHEMA_NAME,
   Discount: res.Data.DISCOUNT, // Set the Discount value from your data
  Inactive: res.Data.IS_INACTIVE

    })

    console.log(this.formsource.value);
    
  });
  
}

}


@NgModule({
  imports: [
    DxDataGridModule, DxButtonModule,DxValidatorModule, CommonModule, DxNumberBoxModule,DxPopupModule, DxFormModule, DxCheckBoxModule, DxoToolbarModule, ReactiveFormsModule,
],
  providers: [],
  exports: [SchemaComponent],
  declarations: [SchemaComponent],
})
export class SchemaModule {}