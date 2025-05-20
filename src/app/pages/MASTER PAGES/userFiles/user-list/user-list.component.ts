import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DxDataGridModule,
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxCheckBoxModule,
  DxPopupModule,
  DxDataGridComponent,
  
  DxValidatorComponent,
  DxFormComponent,
  DxTagBoxComponent,
  DxTagBoxModule,
  DxRadioGroupModule,
  DxValidatorModule,
  DxFormModule,
} from 'devextreme-angular';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { FormPopupModule } from 'src/app/components';
import {
  DxTextBoxComponent,
  DxTextBoxTypes,
} from 'devextreme-angular/ui/text-box';
import { DataService } from 'src/app/services';
type EditorOptions = DxTextBoxTypes.Properties;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {

UserType = ['Administration', 'Entry User', 'HO User'];


confirmPasswordValue: any;
  userData: any;
  passwordForm: any;
  department_list: any[];
  changePasswordMode(arg0: string) {
   
  }
  @ViewChild(DxDataGridComponent, { static: true }) form!: DxFormComponent;
  @ViewChild('confirmPasswordBox', { static: false })
  confirmPasswordField!: DxTextBoxComponent;
  @ViewChild(DxValidatorComponent, { static: false })
  confirmPasswordValidator!: DxValidatorComponent;
  dataGrid!: DxDataGridComponent;

formData = { IS_INACTIVE: false,pwd:''};

  dataSource: any=[
    {
      USER_ID: 1,
      USER_NAME: 'Admin',
      LOGIN_NAME: 'admin',
    }
  ];
  passwordMode: 'password' | 'text' = 'password';
  confirmPasswordMode: 'password' | 'text' = 'password';
  addPopup: boolean = false;
  formsource: FormGroup;
  IS_INACTIVE: boolean = false;
  showHeaderFilter = true;
  editPopup: boolean = false;
  editUserData: any;
  selectedUserType: any;
  selectedDepartmentId: any[] = [];
  selectedStatus: any;
  popupWidth = 400;
  userHospital: any;
  // IS_ADMIN: boolean = false;
  // IS_ENTRY_USER: boolean = false;
  // IS_HO_USER: boolean = false;

  Status: any;

  CollectionDisplay: boolean = false;
  //edit
  selectedData: any;
  USER_NAME: any;
  LOGIN_NAME: any;
  PASSWORD: any;
  DEPARTMENT_ID: any;

  departments: any;
  userId: any;
  UserName_Value: any;
  LoginName_Value: any;
  Password_Value: any;
  Inactive_Value: any;
  UserType_Value: any;
  Admin_Value: any;
  Entry_Value: any;
  HO_Value: any;
  isHOUser:boolean=false;
  isAdmin: boolean=false;
  isEntryUser: boolean=false;

closePop() {
  this.addPopup = false;
    this.editPopup = false;
    this.formsource.reset();
    this.selectedUserType = [];
    this.confirmPasswordMode = 'password';

    Object.keys(this.formsource.controls).forEach((key) => {
      this.formsource.get(key)?.setErrors(null);
      this.formsource.get(key)?.markAsPristine();
      this.formsource.get(key)?.markAsUntouched();
      this.formsource.get(key)?.updateValueAndValidity();
    });

    // Reset DevExtreme validation (for dx-text-box)
    
    setTimeout(() => {
      document.querySelectorAll('.dx-validator').forEach((element) => {
        const validatorInstance = (
          window as any
        ).DevExpress.validationEngine.getInstance(element);
        if (validatorInstance) {
          validatorInstance.reset();
        }
      });
    }, 100);
}

constructor(private fb: FormBuilder , private dataservice: DataService) {
    this.formsource = this.fb.group({
      USER_NAME: ['', Validators.required], // Set default value as empty string ''
      LOGIN_NAME: ['', Validators.required],
      PASSWORD: ['', Validators.required],
      C_PASSWORD: [null],
      IS_INACTIVE: [false], // Boolean default false
     Department_Id: [''],
      IS_ADMIN: [false],
      IS_ENTRY_USER: [false],
      IS_HO_USER: [false],
    })

   this.department_dropdown_list();

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

 }

getStatusFlagClass(IS_INACTIVE: boolean): string {
  return IS_INACTIVE ? 'flag-red' : 'flag-green';
}

  refreshData() {
    this.dataGrid.instance.refresh();
  }

  // onExporting(event: any) {
  //   const fileName = 'file-name';
  //   this.service.exportDataGrid(event, fileName);
  // }


    ngOnDestroy() {
    window.removeEventListener('resize', this.setPopupWidth.bind(this));
    }
    
    setPopupWidth() {
    this.popupWidth = window.innerWidth <= 600 ? 400 : 500;
    }

    checkPasswords = (e: any) => {
    if (!e.value) return true; // Do not validate empty input
    return e.value === this.formData.pwd;
  };
  
  // isDeleteIconVisible({ row }: { row: any }): boolean {
  //   return row.data.USER_ID !== 1;
  // }

  // Function to generate serial numbers dynamically
  getSerialNumber = (rowIndex: number) => {
    return rowIndex + 1;
  };

   passwordComparison = () => {
    return this.formsource.get('PASSWORD')?.value;
  };

  togglePasswordVisibility = () => {
    this.passwordMode = this.passwordMode === 'password' ? 'text' : 'password';
  };

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordMode =
      this.confirmPasswordMode === 'password' ? 'text' : 'password';
  }

  confirmPasswordEditorOptions: EditorOptions = {
    mode: 'password',
    valueChangeEvent: 'keyup',
    buttons: [
      {
        name: 'password',
        location: 'after',
        options: {
          icon: 'eyeopen',
          stylingMode: 'text',
          onClick: () => this.changePasswordMode('ConfirmPassword'),
        },
      },
    ],
  };

  onEditingStart(event:any){
 event.cancel = true;
    this.editUserData = event.data;
    this.editPopup = true;

    this.selectedUserType = event.data.UserType;
  }

  //=======DROPDOWN=========
  department_dropdown_list(){
  this.dataservice.get_dropdown_department_api(name).subscribe((res:any)=>{
    console.log(res,'=========department_dropdown_list========');
   this.department_list=res
   
  })
}

addData() {
 this.addPopup = true;
    this.formsource.reset();
}


openPopup() {
 this.addPopup = true;
    this.formsource.reset();
}
editData() {
  this.addPopup = false;
}
  
}

@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxLookupModule,
    DxDataGridModule,
    DxButtonModule,
    FormPopupModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxPopupModule,
    DxTagBoxModule,
    DxRadioGroupModule,
    DxFormModule,
    DxValidatorModule,
    ReactiveFormsModule
  ],
  providers: [],
  exports: [UserListComponent],
  declarations: [UserListComponent],
})
export class UserListModule {}





