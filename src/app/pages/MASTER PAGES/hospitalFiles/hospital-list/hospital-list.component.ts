import { Component, NgModule, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxButtonModule, DxCheckBoxModule, DxDataGridComponent, DxDataGridModule, DxFormModule, DxPopupModule } from 'devextreme-angular';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { EditingStartEvent } from 'devextreme/ui/data_grid';


@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.scss']
})
export class HospitalListComponent {
selectedData: any;
onEditingStart(event : any) {
   event.cancel=true;
    this.editHospitalData=event.data;
    this.editPopup=true;
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
editHospitalData:any;

dataSource: any[]=[{
  ID: 1,
  HOSPITAL: 'Hospital A',
  IS_INACTIVE: false,
},
{
  ID: 2,
  HOSPITAL: 'Hospital B',
  IS_INACTIVE: true,
},
{
  ID: 3,
  HOSPITAL: 'Hospital C',
  IS_INACTIVE: false,
},
{
  ID: 4,
  HOSPITAL: 'Hospital D',
  IS_INACTIVE: true,
}];
dataservice: any;

updatedHospitalData:any;

openPopup(){
  this.addPopup=true
  this.formsource.reset();
}



constructor(private fb:FormBuilder){
 this.formsource=this.fb.group({
  Id: [null],
  Hospital:["",[Validators.required]],
  Inactive:[false,[Validators.required]]

 })
  //  this.get_Hospital_List()
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
// this.service.exportDataGrid(event, fileName);

} 
getSerialNumber=(rowIndex: number)=> {
  return rowIndex + 1;
}

// get_Hospital_List(){
// this.dataservice.get_HospitalData_List().subscribe((response:any)=>{
//   if(response){
//     this.dataSource = response.Data.map((item:any, index:any) => ({
//       ...item,
//       "SlNo": index + 1, // Assign serial number
//     }));
//     // console.log(response.data);
//   }
// })
// }

addData() {

}
editData() {

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


