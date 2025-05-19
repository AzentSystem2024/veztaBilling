import { Component, NgModule, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxButtonModule, DxCheckBoxModule, DxDataGridComponent, DxDataGridModule, DxFormModule, DxPopupModule } from 'devextreme-angular';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { EditingStartEvent } from 'devextreme/ui/data_grid';
import notify from 'devextreme/ui/notify';
import { get } from 'jquery';
import { DataService } from 'src/app/services';


@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.scss']
})
export class HospitalListComponent {
selectedData: any;
  Hospital_Value: any;
  Status: any;
onEditingStart(event : any) {
   event.cancel=true;
    this.editHospitalData=event.data;
    this.editPopup=true;
    this.select_Hospital_Data(event)
}
  
@ViewChild(DxDataGridComponent, { static: true })
    
  dataGrid!: DxDataGridComponent;

PopupWidth = 400;
Inactive:boolean=false;
showHeaderFilter = true;
addPopup : boolean = false;
isMobile:boolean=false;
editPopup : boolean = false;  
IS_INACTIVE: boolean = false;

//form source for add  hospital
formsource:FormGroup;



//store value for edit 
editHospitalData:any=[]

dataSource: any = [];

updatedHospitalData:any;

openPopup(){
  this.addPopup=true
  this.formsource.reset();
}



constructor(private fb:FormBuilder ,private dataservice: DataService) {
 this.formsource=this.fb.group({
  Id: [null],
  Hospital:["",[Validators.required]],
  Inactive:[false,[Validators.required]]

 })
   this.get_Hospital_List()
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


ngOnInit() {
  this.setPopupWidth();
  window.addEventListener('resize', this.setPopupWidth.bind(this));
  }
  
  ngOnDestroy() {
  window.removeEventListener('resize', this.setPopupWidth.bind(this));
  }
  
  setPopupWidth() {
  this.PopupWidth = window.innerWidth <= 600 ? 400 : 500;
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


formatStatus(data:any){
return data.IS_INACTIVE ?  'Inactive' : 'Active';
}



refreshData() {
this.dataGrid.instance.refresh()
}

onExporting(event: any) {
// console.log('Exporting event', event);

const fileName = 'file-name';
this.dataservice.exportDataGrid(event, fileName);

} 
getSerialNumber=(rowIndex: number)=> {
  return rowIndex + 1;
}

get_Hospital_List(){
  console.log('get_Hospital_List');
  
this.dataservice.get_HospitalData_List().subscribe((response:any)=>{
  console.log('get_Hospital_List',response);

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
  // console.log('formsource',this.formsource);

  const Hospital = this.formsource.value.Hospital

const Inactive =this.formsource.value.Inactive
  
const isDuplicate = this.dataSource.some((data:any)=>{
return data.HOSPITAL_NAME.toLowerCase() === Hospital.toLowerCase()
})
 if(isDuplicate){
    notify(
      {
        message: 'Hospital already exists',
        position: { at: 'top right', my: 'top right' },
        displayTime: 500,
      },
      'error'
    );
    return;
 }

    if(Hospital){
      this.dataservice.Insert_HospitalData_Api(Hospital,Inactive).subscribe((response:any)=>{
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
    })
  } 
     else{
      notify(
        {
          message: 'Please fill the fields',
          position: { at: 'top right', my: 'top right' },
          displayTime: 500,
        },
        'error'
      );
     }  

     this.get_Hospital_List()
}

//
editData(){

const ID = this.formsource.value.Id
const Hospital = this.formsource.value.Hospital
const Inactive =this.formsource.value.Inactive

const isDuplicate = this.dataSource.some((data:any)=>{
  return data.HOSPITAL_NAME.toLowerCase() === Hospital.toLowerCase() && data.ID !== ID //Exclude the current hospital
 });
   if(isDuplicate){
    this.get_Hospital_List()
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
   
if(Hospital){
this.dataservice.Update_HospitalData_Api(ID,Hospital,Inactive).subscribe((response:any)=>{
  notify(
    {
      message: 'Data succesfully added',
      position: { at: 'top right', my: 'top right' },
      displayTime: 500,
    },
    'success'
  );
  this.get_Hospital_List()
 
});
this.get_Hospital_List()
} 
 else{

  notify(
    {
      message: 'Please fill the fields',
      position: { at: 'top right', my: 'top right' },
      displayTime: 500,
    },
    'error'
  );
 } 
 this.editPopup=false;
 this.get_Hospital_List();
}

select_Hospital_Data(e:any){
  console.log(e);
  const ID = e.data.ID;
  this.dataservice.Select_HospitalData_Api(ID).subscribe((res:any)=>{
    console.log(res,"result");
    this.selectedData = res.Data;
  console.log(this.selectedData);

  this.Hospital_Value = this.selectedData.HOSPITAL_NAME;
  this.Status = this.selectedData.IS_INACTIVE;
  console.log(this.Hospital_Value, this.Status);
    
  });
  
}

deleteData(event:any){
const ID = event.data.ID

if(ID){
  this.dataservice.Delete_Hospital_Api(ID).subscribe((response:any)=>{
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


}

@NgModule({
  imports: [
    DxDataGridModule, DxButtonModule, DxPopupModule, DxFormModule, DxCheckBoxModule, DxoToolbarModule, ReactiveFormsModule,
],
  providers: [],
  exports: [HospitalListComponent],
  declarations: [HospitalListComponent],
})
export class HospitalListModule {}


