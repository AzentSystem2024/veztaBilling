import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import notify from 'devextreme/ui/notify';
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
  ExportingEvent,
} from 'devextreme/ui/data_grid';
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
selected_Data:any
  department_Value: any;
  hospital_value: any;
  status_value: any;
  hospital_Dropdown_list: any=[]
  bill_prefix_value: any;
  id_Value: any;
  constructor(private fb: FormBuilder, private dataservice: DataService) {
    this.formsource = this.fb.group({
      ID: [null],
      DepartmentName:  ['', Validators.required],
    Hospital: ['', Validators.required],
      bill_prefix:["", [Validators.maxLength(3)]],
      IS_INACTIVE: [false],
    });
this.department_Value = this.departments.DEPARTMENT;
this.formsource.patchValue({
  DepartmentName: this.departments.DEPARTMENT
});
    this.hospital_value = this.departments.HOSPITAL_ID;
this.formsource.patchValue({
  Hospital: this.departments.HOSPITAL_ID
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
  
    this.select_dep_list(event)
  }
  onExporting($event: ExportingEvent) {}
  
  changeHospitals(event: any) {
    
  const selectedValue = event.value;
  this.formsource.get('Hospital')?.setValue(selectedValue);
  this.formsource.get('Hospital')?.markAsTouched(); 
  }
  onDepartmentChanged(e: any) {
  const newValue = e.value;
  this.formsource.get('DepartmentName')?.setValue(newValue);
  this.formsource.get('DepartmentName')?.markAsTouched(); // for showing validation error if empty
}


  openPopup() {
    this.isAddPop = true;
    this.formsource.reset()
  }
  departments: any = [];

  formatStatus(data: any) {
    return data.IS_INACTIVE ? 'Inactive' : 'Active';
  }

  //========================== close popup=========================
  closePopup() {
    this.isAddPop = false;
    this.isEditPop = false;
  }
  //====================Get department List=================
getDepartment_list() {
  this.dataservice.get_department_List().subscribe((res: any) => {
    console.log(res);

    // Add SlNo to each department item
    this.Department_Data = res.Data.map((item: any, index: number) => ({
      ...item,
      SlNo: index + 1
    }));

    console.log(this.Department_Data, '======Department list with SlNo======');

    this.departments = this.Department_Data;
  });
}

  //=================dropdown==================


hospital_Dropdown(){
  this.dataservice.get_dropdown_hospital_api(name).subscribe((res:any)=>{
    console.log(res,'=======hospitals================')

    this.hospital_Dropdown_list=res
  })
}

  //=======================Delete Data==================
delete_Department_Data(event: any) {
   const id = event.data.ID;
   console.log(id,'=========id value======')
   this.dataservice.delete_department_api(id).subscribe((res:any)=>{
    console.log(res)

notify(
      {
        message: 'Department deleted successfully.',
        position: { at: 'top right', my: 'top right' },
        displayTime: 1000,
      },
      'success'
    );
   })

}
getStatusFlagClass(IS_INACTIVE: boolean): string {
  return IS_INACTIVE ? 'flag-red' : 'flag-green';
}

  //===========================Add Department Data=========================

  // addData() {
  //   console.log(this.formsource.value);
  //   this.isAddPop = false;
  //   const department=this.formsource.value.DepartmentName
  //    const Hospital=this.formsource.value.Hospital
  //     const is_Inactive=this.formsource.value.IS_INACTIVE
  //     const Bill_prefix=this.formsource.value.bill_prefix
  //     console.log(department,Hospital,is_Inactive,Bill_prefix,'====input datas');
      
  //   this.dataservice.Add_Department_Api(department,Hospital,is_Inactive,Bill_prefix).subscribe((res:any)=>{
  //     console.log(res)
  //     this.getDepartment_list()
      
  //         notify(
  //           {
  //             message: 'Department Added successfully',
  //             position: { at: 'top right', my: 'top right' },
  //             displayTime: 500,
  //           },
  //           'success'
  //         );
  //         this.isAddPop=false
  //   })
  // }

  addData() {
      this.formsource.markAllAsTouched();

  // If invalid, return early — error will show under textbox
  if (this.formsource.invalid) {
    return;
  }
  console.log(this.formsource.value);
  
  const department = this.formsource.value.DepartmentName
  const Hospital = this.formsource.value.Hospital;
  const is_Inactive = this.formsource.value.IS_INACTIVE;
  const Bill_prefix = this.formsource.value.bill_prefix;

const isInactiveBoolean = is_Inactive === 'true' || is_Inactive === true;
if (!Hospital) {
  notify(
    {
      message: 'Please select hospital.',
      position: { at: 'top right', my: 'top right' },
      displayTime: 1000,
    },
    'error'
  );
}
else{
  // Check for duplication
  const isDuplicate = this.departments.some(
    (item: any) =>
      item.DEPARTMENT.toLowerCase() === department.toLowerCase() &&
      item.HOSPITAL_ID === Hospital
  );

  if (isDuplicate) {
    notify(
      {
        message: 'This department already exists under the selected hospital.',
        position: { at: 'top right', my: 'top right' },
        displayTime: 1000,
      },
      'error'
    );
    return; // Stop further execution
  }

  // Proceed if no duplicate found
  this.isAddPop = false;

  console.log(department, Hospital, is_Inactive, Bill_prefix, '====input datas');

  this.dataservice.Add_Department_Api(department, Hospital, isInactiveBoolean, Bill_prefix).subscribe((res: any) => {
    console.log(res);
    this.getDepartment_list();

    notify(
      {
        message: 'Department Added successfully',
        position: { at: 'top right', my: 'top right' },
        displayTime: 500,
      },
      'success'
    );

    this.isAddPop = false;
  });
}}

  //===========================select department============================
  select_dep_list(event: any) {
     console.log('===========event',event);
    const id = event.data.ID;
    console.log('===========id',id);
    
    this.dataservice.select_department_Details(id).subscribe((res: any) => {
      console.log(res);
      this.selected_Data=res.Data
    
      console.log(this.selected_Data)
   this.id_Value=this.selected_Data.ID
      this.department_Value=this.selected_Data.DEPARTMENT
      this.hospital_value=this.selected_Data.HOSPITAL_ID
      this.status_value=this.selected_Data.IS_INACTIVE
      this.bill_prefix_value=this.selected_Data.BILL_PREFIX

      console.log(this.department_Value,this.hospital_value,this.status_value,this.bill_prefix_value);
      
        });
  }
  //===========================Update Department Data=========================
  update_Department_Data() {
const id=this.id_Value
 const department=this.department_Value
     const Hospital=this.hospital_value
      const is_Inactive=this.status_value
      const Bill_prefix=this.bill_prefix_value

const isDuplicate = this.departments.some((item: any) => {
  // Skip the current record being edited
  if (item.ID === id) return false;

  return (
    item.DEPARTMENT.toLowerCase().trim() === department.toLowerCase().trim() &&
    item.HOSPITAL_ID === Hospital
  );
});

if (isDuplicate) {
  notify(
    {
      message: 'This department already exists under the selected hospital.',
      position: { at: 'top right', my: 'top right' },
      displayTime: 1000,
    },
    'error'
  );
  return; // Stop further execution
}

    this.dataservice.Update_Department_Api(id,department,Hospital,is_Inactive,Bill_prefix).subscribe((res:any)=>
    {
      console.log(res,'==========updated data');
      this.getDepartment_list()
      this.isEditPop=false
        notify(
    {
      message: 'This department updated successfullyyy.',
      position: { at: 'top right', my: 'top right' },
      displayTime: 1000,
    },
    'success'
  );
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
  ],
  providers: [],
  declarations: [DepartmentComponent],
  exports: [DepartmentComponent],
})
export class DepartmentModule {}
