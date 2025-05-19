import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
} from 'devextreme-angular';
import {
  DxoItemModule,
  DxoFormItemModule,
  DxoLookupModule,
  DxiItemModule,
  DxiGroupModule,
} from 'devextreme-angular/ui/nested';
import {
  EditingStartEvent,
  ExportingEvent,
  RowRemovingEvent,
} from 'devextreme/ui/data_grid';
import { ValueChangedEvent } from 'devextreme/ui/select_box';
import * as e from 'express';
import { FormTextboxModule } from 'src/app/components';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent {
  formsource: FormGroup;
  isAddPop: boolean = false;
  isEditPop: boolean = false;
  Department_Data: any = [];
  updatedDepartmentData: any = [];
selected_Data:any
  department_Value: any;
  hospital_value: any;
  status_value: any;
  constructor(private fb: FormBuilder, private dataservice: DataService) {
    this.formsource = this.fb.group({
      ID: [null],
      DepartmentName: [''],
      Hospital: [''],
      bill_prefix:[''],
      Status: [false],
    });
    this.getDepartment_list();
    this.hospital_Dropdown()
  }
  
  //=========================onEditingStart=========================

  onEditingStart(event: any) {
    console.log('on editing start======================',event);
    event.cancel = true;
    console.log('on editing start');
    console.log(event);
    this.isEditPop = true;
    this.updatedDepartmentData;
    this.select_dep_list(event)
  }
  onExporting($event: ExportingEvent) {}
  
  changeHospitals(event: any) {}

  openPopup() {
    this.isAddPop = true;
  }
  departments: any = [];
  formatStatus(data: any) {
    return data.Status ? 'Inactive' : 'Active';
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
  //====================Get department List=================
  getDepartment_list() {
    this.dataservice.get_department_List().subscribe((res: any) => {
      console.log(res);
      this.Department_Data = res.Data;
      console.log(this.Department_Data, '======Department list======');
      this.departments = this.Department_Data;
    
    });
  }
  //=================dropdown==================


hospital_Dropdown(){
  this.dataservice.get_dropdown_hospital_api(name).subscribe((res:any)=>{
    console.log(res,'=======hospitals================')
  })
}

  //=======================Delete Data==================
delete_Department_Data(event: any) {
   const id = event.data.ID;
   console.log(id,'=========id value======')
   this.dataservice.delete_department_api(id).subscribe((res:any)=>{
    console.log(res)



    alert('data deleted')
   })

}

  //===========================Add Department Data=========================

  addData() {
    console.log(this.formsource.value);
    this.isAddPop = false;
    const department=this.formsource.value.DepartmentName
     const Hospital=this.formsource.value.Hospital
      const is_Inactive=this.formsource.value.Status
    this.dataservice.Add_Department_Api(department,Hospital,is_Inactive).subscribe((res:any)=>{
      console.log(res)
    })
  }
  //===========================select department============================
  select_dep_list(event: any) {
     console.log('===========event',event);
    const id = event.data.ID;
    console.log('===========id',id);
    
    this.dataservice.select_department_Details(id).subscribe((res: any) => {
      console.log(res);
      this.selected_Data=res.Data
    
      console.log(this.selected_Data)
      this.department_Value=this.selected_Data.DEPARTMENT
      this.hospital_value=this.selected_Data.HOSPITAL_ID
      this.status_value=this.selected_Data.IS_INACTIVE
      console.log(this.department_Value,this.hospital_value,this.status_value);
      
        });
  }
  //===========================Update Department Data=========================
  update_Department_Data() {}
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
  ],
  providers: [],
  declarations: [DepartmentComponent],
  exports: [DepartmentComponent],
})
export class DepartmentModule {}
