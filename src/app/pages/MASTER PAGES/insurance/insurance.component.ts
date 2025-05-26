import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFormModule, DxPopupModule, DxTextBoxModule } from 'devextreme-angular';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { EditingStartEvent, RowRemovedEvent } from 'devextreme/ui/data_grid';
import notify from 'devextreme/ui/notify';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent {

  PopupWidth = 400;
   Insurance_Value: any;
   Status: any;
  addPopup : boolean = false;
  editPopup : boolean = false;
  formsource:FormGroup;
 dataSource: any = [];
  editInsuranceData: any;
  selectedData: any;
showFilterRow: boolean = true;
currentFilter: string = 'auto';

  openPopup(){
  this.addPopup = true
  this.formsource.reset({
    Inactive: ""
  });
  }

  closePop(){
    this.addPopup=false;
  this.editPopup=false;
this.formsource.reset()
  this.formsource.reset({
    Inactive: false // Set the checkbox back to unchecked
  });
  console.log(this.formsource,'reset');
  
  }

  constructor(private fb:FormBuilder ,private dataservice: DataService) {
   this.formsource=this.fb.group({
    Id: [null],
    Insurance:["",[Validators.required]],
    Inactive:[false,[Validators.required]]
  
   })
   this.get_Insurance_List()
  }
  
// formatStatus(data:any){
// return data.IS_INACTIVE ?  'Inactive' : 'Active';
// }

getSerialNumber=(rowIndex: number)=> {
  return rowIndex + 1;
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

  onExporting(event:any){}

onEditingStart(event:any) {
event.cancel=true;
    this.editInsuranceData=event.data;
    this.editPopup=true;
    this.select_Insurance_Data(event);
}

getStatusFlagClass(IS_INACTIVE: boolean): string {
  return IS_INACTIVE ? 'flag-red' : 'flag-green';
}

get_Insurance_List(){
  console.log('get_Insurance_List');
  
this.dataservice.get_InsuranceData_List().subscribe((response:any)=>{
  console.log('get_Insurance_List',response);

  if(response){
    this.dataSource = response.Data.map((item:any, index:any) => ({
      ...item,
      "SlNo": index + 1, // Assign serial number
    }));
    // console.log(response.data);
  }
})
}

//===========SELECT DATA=========================
select_Insurance_Data(e:any){
  console.log(e);
  const ID = e.data.ID;
  this.dataservice.Select_InsuranceData_Api(ID).subscribe((res:any)=>{
    console.log(res,"result");
    // this.select_Data = res;
    // this.updatedHospitalData = {...res};
    this.formsource.patchValue({
  Id: res.Data.ID,
  Insurance: res.Data.INSURANCE_NAME,
  Inactive: res.Data.IS_INACTIVE

    })

    console.log(this.formsource.value);
    
  });
}


deleteData(event:any){
const ID = event.data.ID

if(ID){
  this.dataservice.Delete_Insurance_Api(ID).subscribe((response:any)=>{
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

addData(){
  const Insurance = this.formsource.value.Insurance
  const Inactive =this.formsource.value.Inactive
   const isInactiveBoolean = Inactive === 'true' || Inactive === true;

   
if (!Insurance) {
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
return data.INSURANCE_NAME.toLowerCase() === Insurance.toLowerCase()
})
 if(isDuplicate){
    notify(
      {
        message: 'Insurance already exists',
        position: { at: 'top right', my: 'top right' },
        displayTime: 500,
      },
      'error'
    );
    return;
 }

    if(Insurance){
      console.log("function called");
      
      this.dataservice.Insert_InsuranceData_Api(Insurance,isInactiveBoolean).subscribe((response:any)=>{
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
      this.get_Insurance_List()
    })
  } 
}

editData(){
const ID = this.formsource.value.Id
const Insurance = this.formsource.value.Insurance
const Inactive =this.formsource.value.Inactive


if (!Insurance) {
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
  return data.INSURANCE_NAME.toLowerCase() === Insurance.toLowerCase() && data.ID !== ID //Exclude the current hospital
 });
   if(isDuplicate){
    this.get_Insurance_List()
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
   
if(Insurance){
this.dataservice.Update_InsuranceData_Api(ID,Insurance,Inactive).subscribe((response:any)=>{
  notify(
    {
      message: 'Data succesfully added',
      position: { at: 'top right', my: 'top right' },
      displayTime: 500,
    },
    'success'
  );
  this.editPopup=false
  this.get_Insurance_List()
 
});
this.get_Insurance_List()
} 

}



}

@NgModule({
  imports: [
    DxDataGridModule, DxButtonModule,DxTextBoxModule ,CommonModule ,DxPopupModule, DxFormModule, DxCheckBoxModule, DxoToolbarModule, ReactiveFormsModule,
],
  providers: [],
  exports: [InsuranceComponent],
  declarations: [InsuranceComponent],
})
export class InsuranceModule {}