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
  DxTabPanelComponent,
  DxTabPanelModule,
  DxTreeListModule,
} from 'devextreme-angular';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { FormPopupModule } from 'src/app/components';
import {
  DxTextBoxComponent,
  DxTextBoxTypes,
} from 'devextreme-angular/ui/text-box';
import { DataService } from 'src/app/services';
import notify from 'devextreme/ui/notify';
import  Validator  from 'devextreme/ui/validator';
import { get } from 'jquery';
import { UserMenuModule } from "../../user-menu/user-menu.component";

type EditorOptions = DxTextBoxTypes.Properties;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
[x: string]: any;

UserType :any
user: any;
selectedTabIndex = 0;
confirmPasswordValue: any;
  userData: any;
  passwordForm: any;
  department_list: any;
  hospital_list : any [];
  usertype_list:any[];
  user_Id_value: any;
 
  @ViewChild(DxDataGridComponent, { static: true }) form!: DxFormComponent;
  @ViewChild('confirmPasswordBox', { static: false })
  confirmPasswordField!: DxTextBoxComponent;
  @ViewChild(DxValidatorComponent, { static: false })
  confirmPasswordValidator!: DxValidatorComponent;
  dataGrid!: DxDataGridComponent;
  @ViewChild('dxFormRef', { static: false }) dxFormInstance: any;


formData = { IS_INACTIVE: false,pwd:''};

  dataSource: any=[{}];
  passwordMode: 'password' | 'text' = 'password';
  confirmPasswordMode: 'password' | 'text' = 'password';

  addPopup: boolean = false;
  formsource: FormGroup;
  IS_INACTIVE: boolean = false;
  ADD_INVOICE: boolean = false;
  VIEW_INVOICE: boolean = false;
  CANCEL_INVOICE: boolean = false;
  showHeaderFilter = true;
  editPopup: boolean = false;
  isGridDisabled = false
  editUserData: any;
  selectedUserType: any;
  selectedDepartmentId: any; 
  selectedHospitalId:any[] = [];
  selectedStatus: any;
  popupWidth = 400;
  userHospital: any;
  showFilterRow: boolean = true;
  currentFilter: string = 'auto';
  Status: any;


  CollectionDisplay: boolean = false;
  //edit
  selectedData: any=[]
  USER_NAME: any;
  LOGIN_NAME: any;
  PASSWORD: any;
  DEPARTMENT_ID: any;
  HOSPITAL_ID : any;

  departments: any;
  userId: any;
  UserName_Value: any;
  LoginName_Value: any;
  Password_Value: any;
  Inactive_Value: any;
  UserType_Value: any
  changePasswordMode: any;
  Department_Data: any;
  hos_ID: any;
statuses: Function|any[]
tasks:any=[{
   Task_ID:1,
   Task_Subject: 'Invoice',
   Task_Parent_ID: 0,
},
{
Task_ID:5,
   Task_Subject: 'New invoice ',
   Task_Parent_ID: 1,
},
{
Task_ID:6,
   Task_Subject: 'Invoice list',
   Task_Parent_ID: 1,
},
{
  Task_ID:2,
   Task_Subject: 'Masters',
   Task_Parent_ID: 0,
},
{
  Task_ID:7,
   Task_Subject: 'Department',
   Task_Parent_ID: 2,
},
{
  Task_ID:8,
   Task_Subject: 'Hospital',
   Task_Parent_ID: 2,
},
{
  Task_ID:9,
   Task_Subject: 'Items',
   Task_Parent_ID: 2,
},
{
  Task_ID:3,
   Task_Subject: 'Reports',
   Task_Parent_ID: 0,
},
{
  Task_ID:10,
   Task_Subject: 'Datewise summary',
   Task_Parent_ID: 3,
},
{
  Task_ID:11,
   Task_Subject: 'Billwise summary',
   Task_Parent_ID: 3,
},
{
  Task_ID:12,
   Task_Subject: 'Hospitalwise summary',
   Task_Parent_ID: 3,
},
{
  Task_ID:4,
   Task_Subject: 'Plans 2015',
   Task_Parent_ID: 0,
},
{
  Task_ID:13,
   Task_Subject: 'Plans 2015',
   Task_Parent_ID: 4,
}]

closePop() {
  this.addPopup = false;
    this.editPopup = false;
    this.formsource.reset({
      LoginPassword: 0,
    });
    
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
      ID: [null,Validators.required],  // ✅ Ensure this line exists
      UserName: ['', Validators.required], // Set default value as empty string ''
      LoginName: ['', Validators.required],
      LoginPassword: [null, Validators.required],
      ConfirmPassword: [null,Validators.required],
      Inactive: [false], // Boolean default false
     DepartmentId: [null,[Validators.required]],
     HospitalId : [null,[Validators.required]],
      UserType: ['', [Validators.required]],
      AddInvoice: [false],
      ViewInvoice: [false],
      CancelInvoice: [false],

    })

   this.department_dropdown_list();
   this.hospital_dropdown_list();
   this.get_User_List();
   this.usertype_dropdown_list();
   this.getDepartment_list()
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

 validation:boolean = false;
  
getStatusFlagClass(IS_INACTIVE: boolean): string {
  return IS_INACTIVE ? 'flag-red' : 'flag-green';
}

  refreshData() {
    this.dataGrid.instance.refresh();
  }

    ngOnDestroy() {
    window.removeEventListener('resize', this.setPopupWidth.bind(this));
    }
    
    setPopupWidth() {
    this.popupWidth = window.innerWidth <= 600 ? 400 : 500;
    }


  // Function to generate serial numbers dynamically
  getSerialNumber = (rowIndex: number) => {
    return rowIndex + 1;
  };

 checkPasswords = (e: any) => {
    if (!e.value) return true; // Do not validate empty input
    return e.value === this.formData.pwd;
  };
  

 togglePasswordVisibility = () => {
    this.passwordMode = this.passwordMode === 'password' ? 'text' : 'password';
  };

  toggleConfirmPasswordVisibility=()=> {
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


 isDeleteIconVisible({ row }: { row: any }): boolean {
    return row.data.ID !== 1;
  }

  onEditingStart(event:any){  
    console.log(event,'onEditingStart');
    this.formsource.reset({
    Inactive: "",
    AddInvoice:"",
    ViewInvoice:"",
    CancelInvoice:""
    })
     event.cancel = true;
    this.editUserData = event.data;
    this.editPopup = true;

    this.selectedUserType = event.data.UserType;
    this.select_User_Data(event);
  }

  //=======DROPDOWN=========
  department_dropdown_list(){
  this.dataservice.get_dropdowndepartment_api(name,this.hos_ID).subscribe((res:any)=>{
    console.log(res,'=========department_dropdown_list========');
   this.department_list=res
   
  })
  }

  getDepartment_list() {
  this.dataservice.get_department_List().subscribe((res: any) => {
    console.log(res);

    // Add SlNo to each department item
    this.Department_Data = res.Data.map((item: any, index: number) => ({
      ...item,
      SlNo: index + 1
    }))

    console.log(this.Department_Data, '======Department list with SlNo======');

    //  // Filter based on selectedHospitalId or hos_ID
    // this.department_list = this.Department_Data.filter(
    //   (item) => item.HOSPITAL_ID == this.selectedHo );

    console.log(this.selectedHospitalId, 'Selected Hospital ID');
    console.log(this.department_list, 'Filtered Department List');
    console.log(this.selectedHospitalId);
    console.log( this.Department_Data.filter((item=>item.HOSPITAL_ID==this.hos_ID)));
    

    
  });
}




hospital_dropdown_list(){
  this.dataservice.get_dropdown_hospital_api(name).subscribe((res:any)=>{
console.log(res,'==============hospital dropdown list=======')
   this.hospital_list = res
  })
}

onUserTypeChange(event: any) {
  console.log(event,'onUserTypeChange');
  this.selectedUserType = event.value;
  console.log(this.selectedUserType,'this.selectedUserType');
  
}
 usertype_dropdown_list(){
  this.dataservice.get_dropdown_User_Api(name).subscribe((res:any)=>{
    console.log(res,'=========department_dropdown_list========');
   this.usertype_list=res
   
  })
}

onHospitalValue(event:any){
  this.selectedHospitalId=event.value
  this.hos_ID=event.value
 this.department_dropdown_list()
  console.log(this.hos_ID,'=============Hospital I D=======');
  
}
 get_User_List(){
  console.log('get_User_List');
  
this.dataservice.get_UserData_List_Api().subscribe((response:any)=>{
  console.log('get_User_List',response);

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


 this.validation = true;

    console.log("Button Clicked");
    console.log(this.formsource,'reset');
  const Login_name = this.formsource.get('LoginName')?.value;
  const User_name = this.formsource.get('UserName')?.value;
  const Login_password = this.formsource.get('LoginPassword')?.value;
 const Is_Inactive = this.formsource.get('Inactive')?.value === true;
  // const Department_Id = this.selectedDepartmentId.toString();
  const Department_Id = this.selectedDepartmentId != null ? this.selectedDepartmentId.toString() : '';

  // const Department_Id = this.selectedDepartmentId?.toString() || '';
  // const Department_Id = this.selectedDepartmentId ?? null; // null or number

  // const Hospital_Id = this.selectedHospitalId;
  const Hospital_Id = Array.isArray(this.selectedHospitalId)
  ? Number(this.selectedHospitalId[0]) || 0
  : Number(this.selectedHospitalId) || 0;

  const Usertype = this.formsource.get('UserType')?.value;
  const Add_invoice = this.formsource.get('AddInvoice')?.value === true;
  const View_invoice = this.formsource.get('ViewInvoice')?.value === true;
  const Cancel_invoice = this.formsource.get('CancelInvoice')?.value === true;
  console.log(Login_name,User_name,Login_password,Is_Inactive,Department_Id,Hospital_Id,Usertype,Add_invoice,View_invoice,Cancel_invoice,'add data');

  
const payload = { // or dynamic: this.loggedInUser
   user: 'admin', // ✅ Add this line
  USER_NAME: User_name,
  LOGIN_NAME: Login_name,
  LOGIN_PWD: Login_password,
  USER_TYPE: Usertype,
  IS_INACTIVE: Is_Inactive,
  DEPARTMENT_ID: Department_Id ,
  // HOSPITAL_ID :  Hospital_Id ?? 0  ,
  HOSPITAL_ID: Hospital_Id,
  ADD_INVOICE : Add_invoice,
  VIEW_INVOICE : View_invoice,
  CANCEL_INVOICE : Cancel_invoice,
};

 if (!User_name || !Login_name || !Login_password || !Usertype) {
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


   // 🚫 New condition: Hospital User must select hospital
  if (Usertype === 3 && !Hospital_Id) {
    notify({
      message: 'Please select the hospital',
      position: { at: 'top right', my: 'top right' },
      displayTime: 1500,
    }, 'error');
    return;
  }

    // 🚫 New condition: Hospital User must select hospital
  if (Usertype === 4 && !Department_Id ) {
    notify({
      message: 'Please select the department',
      position: { at: 'top right', my: 'top right' },
      displayTime: 1500,
    }, 'error');
    return;
    
  }

// Optional: Check for duplicate login name
  const isDuplicate = this.dataSource?.some((data: any) => {
    return data.LOGIN_NAME?.trim().toLowerCase() === Login_name.toLowerCase() 
  });

  if (isDuplicate) {
    notify(
      {
        message: 'Login name already exists',
        position: { at: 'top right', my: 'top right' },
        displayTime: 1000,
      },
      'error'
    );
    return;
  }
  
     if (Login_password !== this.formsource.get('ConfirmPassword')?.value) {
    notify(
      {
        message: 'Both Password and Confirm Password do not match',
        position: { at: 'top right', my: 'top right' },
        displayTime: 1500,
      },
      'error'
    );
    return; // 🚫 prevent saving
  }
     
     if(Login_name && User_name && Login_password  && Usertype) {
      this.dataservice
        .Insert_User_Api(payload)
        .subscribe((res: any) => {
          console.log(res, 'insert response');
          
          console.log("function called");
          
          notify(
            {
              message: 'Data succesfully added',
              position: { at: 'top right', my: 'top right' },
              displayTime: 500,
            },
            'success'
          );
          
          this.addPopup = false;
          this.formsource.reset();
          this.selectedUserType = null;
         this.editPopup = false;
          
         this.dxFormInstance?.instance?.resetValidation();
          this.get_User_List();
         
        });
  } 
}

openPopup() {
 this.addPopup = true;
 this.validation = false;
    this.formsource.reset({
    Inactive: "",
    AddInvoice:"",
    ViewInvoice:"",
    CancelInvoice:"",
    DepartmentId:null,
    HospitalId:""
     
  });
    
}

onAddPopupClose(){
   this.formsource.reset();
     this.dxFormInstance?.instance?.resetValidation();
 this.selectedUserType = null;
}

editData() {
  console.log("Edit Button Clicked");

  // Extract values from the form
  const Id = this.formsource.get('ID')?.value;
  const Login_name = this.formsource.get('LoginName')?.value?.trim();
  const User_name = this.formsource.get('UserName')?.value?.trim();
  const Login_password = this.formsource.get('LoginPassword')?.value?.trim();
  const Is_Inactive = this.formsource.get('Inactive')?.value === true;
  const Department_Id = this.selectedDepartmentId.toString();
  
  const Hospital_Id = this.selectedHospitalId;
  const Usertype = this.user_Id_value;
  const Add_invoice = this.formsource.get('AddInvoice')?.value === true;
  const View_invoice = this.formsource.get('ViewInvoice')?.value === true;
  const Cancel_invoice = this.formsource.get('CancelInvoice')?.value === true;

  // Debug log
  console.log({ Id, Login_name, User_name, Login_password, Is_Inactive, Department_Id, Hospital_Id ,Usertype , Add_invoice, View_invoice, Cancel_invoice }, 'Edit Data Payload');

  // Prepare payload
  const payload = {
     user: 'admin', // ✅ Add this line
    ID: Id,
    // user: 'admin', // Or this.loggedInUser
    USER_NAME: User_name,
    LOGIN_NAME: Login_name,
    LOGIN_PWD: Login_password,
    USER_TYPE: Usertype,
    IS_INACTIVE: Is_Inactive,
    DEPARTMENT_ID: Department_Id,
    HOSPITAL_ID : Hospital_Id,
    ADD_INVOICE: Add_invoice,
    VIEW_INVOICE: View_invoice,
    CANCEL_INVOICE: Cancel_invoice,
  };

  if (!User_name || !Login_name || !Login_password || !Usertype) {
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

  
   // 🚫 New condition: Hospital User must select hospital
  if (Usertype === 3 && !Hospital_Id) {
    notify({
      message: 'Please select the hospital',
      position: { at: 'top right', my: 'top right' },
      displayTime: 1500,
    }, 'error');
    return;
  }

  // 🚫 New condition: Hospital User must select hospital
  // if (Usertype === 4 && !Department_Id) {
  //   notify({
  //     message: 'Please select the department',
  //     position: { at: 'top right', my: 'top right' },
  //     displayTime: 1500,
  //   }, 'error');
  //   return;
  // }

  if (Usertype === 4 && (!Department_Id || Department_Id === 0)) {
  notify(
    {
      message: 'Please select the department',
      position: { at: 'top right', my: 'top right' },
      displayTime: 1500,
    },
    'error'
  );
  return;
}



  // Optional: Check for duplicate login name
  const isDuplicate = this.dataSource?.some((data: any) => {
    return data.LOGIN_NAME?.trim().toLowerCase() === Login_name.toLowerCase() && data.ID !== Id;
  });

  if (isDuplicate) {
    notify(
      {
        message: 'Login name already exists',
        position: { at: 'top right', my: 'top right' },
        displayTime: 1000,
      },
      'error'
    );
    return;
  }


  if (Login_password !== this.formsource.get('ConfirmPassword')?.value) {
    notify(
      {
        message: 'Both Password and Confirm Password do not match',
        position: { at: 'top right', my: 'top right' },
        displayTime: 1500,
      },
      'error'
    );
    return; // 🚫 prevent saving
  }

  // Call API
  this.dataservice.Update_User_Api(payload).subscribe({
    next: (res: any) => {
      console.log(res, 'API Response');

      notify(
        {
          message: 'Data successfully updated',
          position: { at: 'top right', my: 'top right' },
          displayTime: 1000,
        },
        'success'
      );

      this.addPopup = false;
      this.formsource.reset();
      this.get_User_List();
      this.editPopup = false;
    },
  });
}


 select_User_Data(e:any){
  console.log(e);
  const ID = e.data.ID;
  
  this.dataservice.Select_UserData_Api(ID).subscribe((res:any)=>{
    console.log(res,"result");

    this.selectedData=res.Data
    console.log(this.selectedData,'============selected data===================');
    
this.selectedDepartmentId =Number(this.selectedData.DEPARTMENT_ID)
console.log(this.selectedDepartmentId,'selectedDepartmentId');


    console.log(this.selectedData,'selected data');
    
    // this.select_Data = res;
    // this.updatedHospitalData = {...res};
    this.formsource.patchValue({
  ID: res.Data.ID,
  Id: res.Data.ID,
  UserName: res.Data.USER_NAME,
  LoginName: res.Data.LOGIN_NAME,
  LoginPassword: res.Data.LOGIN_PWD, 
  ConfirmPassword:res.Data.LOGIN_PWD,// Set the Discount value from your data
  Inactive: res.Data.IS_INACTIVE,
  DepartmentId: res.Data.DEPARTMENT_ID,
  HospitalId :res.Data.HOSPITAL_ID,
  UserType: res.Data.USER_TYPE,
  AddInvoice :res.Data.ADD_INVOICE,
  ViewInvoice : res.Data.VIEW_INVOICE,
  CancelInvoice : res.Data.CANCEL_INVOICE,
    })

    this.selectedUserType = res.Data.USER_TYPE

    console.log(this.formsource.value);
    
  });
  this.user_Id_value=e.data.USER_TYPE;

console.log(this.user_Id_value,'user============================================');


this.selectedHospitalId = (e.data.HOSPITAL_ID)
console.log(this.selectedHospitalId, 'selectedHospitalId');

  
}

 deleteData(event:any){

   if (event.data.USERTYPE === 1) {
    event.cancel = true;
    notify(
      {
        message: "Admin users cannot be deleted.",
        position: { at: 'top right', my: 'top right' },
        displayTime: 500,
      },
      'error'
    );
    return;
  }

const ID = event.data.ID

if(ID){
  this.dataservice.Delete_User_Api(ID).subscribe((response:any)=>{
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
    DxTabPanelModule,
    ReactiveFormsModule,
    DxTabPanelModule,
    DxTreeListModule,
],
  providers: [],
  exports: [UserListComponent],
  declarations: [UserListComponent],
})
export class UserListModule {}





