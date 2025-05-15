import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxTextBoxModule, DxCheckBoxModule, DxRadioGroupModule, DxFileUploaderModule, DxDataGridModule, DxButtonModule, DxValidatorModule, DxProgressBarModule, DxPopupModule, DxDropDownBoxModule, DxToolbarModule, DxTabPanelModule, DxTabsModule, DxNumberBoxModule, DxDataGridComponent, DxSelectBoxComponent, DxTextBoxComponent, DxDateBoxComponent } from 'devextreme-angular';
import { DxoItemModule, DxoFormItemModule, DxoLookupModule, DxiItemModule, DxiGroupModule } from 'devextreme-angular/ui/nested';
import { EditingStartEvent, ExportingEvent, RowRemovingEvent } from 'devextreme/ui/data_grid';
import { ValueChangedEvent } from 'devextreme/ui/select_box';
import * as e from 'express';
import { FormTextboxModule } from 'src/app/components';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent {

  formsource: any;
isAddPop: boolean=false
isEditPop: boolean=false
updatedDepartmentData: any=[];





onEditingStart(event:any) {

  event.cancel = true;
  console.log('on editing start');
  console.log(event);
  
  this.isEditPop = true;

}
onExporting($event: ExportingEvent) {
throw new Error('Method not implemented.');
}
delete_Department_Data($event: RowRemovingEvent) {
throw new Error('Method not implemented.');
}
changeHospitals($event) {
}


openPopup() {
this.isAddPop = true;
}


addData() {
throw new Error('Method not implemented.');
}
 departments: any=[{
  DepartmentID: 1,
  DepartmentName: "Cardiology",
  Hospital: "City Hospital",
  Status: "Active",
 },
 {
  DepartmentID: 2,
  DepartmentName: "Neurology",
  Hospital: "City Hospital",
  IS_INACTIVE: "Inactive",
 },
]
formatStatus(data: any) {
    return data.IS_INACTIVE ? 'Inactive' : 'Active';
  }
statusCellTemplate = (cellElement: any, cellInfo: any) => {
    const status = cellInfo.value; // Get the value from calculateCellValue
  
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

//========================== close popup=========================
closePopup() {
this.isAddPop = false;
this.isEditPop = false;
}
//===========================Update Department Data=========================
update_Department_Data(){

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
    ReactiveFormsModule


  ],
  providers: [],
  declarations: [DepartmentComponent],
  exports: [DepartmentComponent],

})
export class DepartmentModule {}
