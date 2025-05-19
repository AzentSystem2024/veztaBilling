import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFormModule, DxPopupModule } from 'devextreme-angular';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { EditingStartEvent, RowRemovedEvent } from 'devextreme/ui/data_grid';
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
  dataSource: any = [{
    Id: 1,
    INSURANCE_NAME: "Insurance 1",
    IS_INACTIVE: false
  },
  {
    Id: 2,
    INSURANCE_NAME: "Insurance 2",
    IS_INACTIVE: true
  },
  {
    Id: 3,
    INSURANCE_NAME: "Insurance 3",
    IS_INACTIVE: false
  }];
  editInsuranceData: any;

  openPopup(){
  this.addPopup = true
  this.formsource.reset();
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
  }
  
formatStatus(data:any){
return data.IS_INACTIVE ?  'Inactive' : 'Active';
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

deleteData(event:any) {

}


onEditingStart(event:any) {
event.cancel=true;
    this.editInsuranceData=event.data;
    this.editPopup=true;
}

addData(){

}

editData(){

}

}

@NgModule({
  imports: [
    DxDataGridModule, DxButtonModule, DxPopupModule, DxFormModule, DxCheckBoxModule, DxoToolbarModule, ReactiveFormsModule,
],
  providers: [],
  exports: [InsuranceComponent],
  declarations: [InsuranceComponent],
})
export class InsuranceModule {}