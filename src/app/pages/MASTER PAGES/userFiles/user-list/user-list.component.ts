import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  DxValidationGroupModule,
  DxValidationGroupComponent,
  DxLoadPanelModule,
  DxLoadIndicatorModule
} from 'devextreme-angular';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { FormPopupModule } from 'src/app/components';
import {
  DxTextBoxComponent,
  DxTextBoxTypes,
} from 'devextreme-angular/ui/text-box';
import { DataService } from 'src/app/services';
import notify from 'devextreme/ui/notify';
import Validator from 'devextreme/ui/validator';
import { get } from 'jquery';
import { UserMenuModule } from '../../user-menu/user-menu.component';

type EditorOptions = DxTextBoxTypes.Properties;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  [x: string]: any;
  isLoading: any;
  isEditPopupLoading: boolean = false;

  UserType: any;
  user: any;
  selectedTabIndex = 0;
  confirmPasswordValue: any;
  userData: any;
  passwordForm: any;
  department_list: any;
  hospital_list: any[];
  usertype_list: any[];
  user_Id_value: any;
  auto: string = 'auto';
  @ViewChild('treeListMenu') treeListMenu: any;

  @ViewChild('formValidationGroup') formValidationGroup: DxValidationGroupComponent;
  @ViewChild(DxDataGridComponent, { static: true }) form!: DxFormComponent;
  @ViewChild('confirmPasswordBox', { static: false })
  confirmPasswordField!: DxTextBoxComponent;
  @ViewChild(DxValidatorComponent, { static: false })
  confirmPasswordValidator!: DxValidatorComponent;
  dataGrid!: DxDataGridComponent;
  @ViewChild('dxFormRef', { static: false }) dxFormInstance: any;

  formData = { IS_INACTIVE: false, pwd: '' };

  dataSource: any = [{}];
  passwordMode: 'password' | 'text' = 'password';
  confirmPasswordMode: 'password' | 'text' = 'password';
  selectedMenuIds: number[] = [];

  addPopup: boolean = false;
  formsource: FormGroup;
  IS_INACTIVE: boolean = false;
  ADD_INVOICE: boolean = false;
  VIEW_INVOICE: boolean = false;
  CANCEL_INVOICE: boolean = false;
  showHeaderFilter = true;
  editPopup: boolean = false;
  isGridDisabled = false;
  editUserData: any;
  selectedUserType: any;
  selectedDepartmentId: any[]=[];
  selectedHospitalId: any[] = [];
  selectedStatus: any;
  popupWidth = 400;
  userHospital: any;
  showFilterRow: boolean = true;
  currentFilter: string = 'auto';
  Status: any;

  CollectionDisplay: boolean = false;
  //edit
  selectedData: any = [];
  USER_NAME: any;
  LOGIN_NAME: any;
  PASSWORD: any;
  DEPARTMENT_ID: any;
  HOSPITAL_ID: any;

  departments: any;
  userId: any;
  UserName_Value: any;
  LoginName_Value: any;
  Password_Value: any;
  Inactive_Value: any;
  UserType_Value: any;
  changePasswordMode: any;
  Department_Data: any;
  hos_ID: any;
  statuses: Function | any[];
  Usermenu: any;

  toggleFilterRow = () => {
    this.isFilterRowVisible = !this.isFilterRowVisible;
  };

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
       this.formValidationGroup?.instance?.reset();
      this.selectedMenuIds = [...this.selectedMenuIds]; // reassign for change detection
    }, 100);
  }

  constructor(private fb: FormBuilder, private dataservice: DataService) {
    this.formsource = this.fb.group({
      ID: [null, Validators.required], // ✅ Ensure this line exists
      UserName: [null, Validators.required], // Set default value as empty string ''
      LoginName: [null, Validators.required],
      LoginPassword: [null, Validators.required],
      ConfirmPassword: [null, Validators.required],
      Inactive: [false], // Boolean default false
      DepartmentId: [null, [Validators.required]],
      HospitalId: [null, [Validators.required]],
      UserType: [null, [Validators.required]],
      AddInvoice: [false],
      ViewInvoice: [false],
      CancelInvoice: [false],
      LastModifiedDate: ['', [Validators.required]],
      Menu: ['', [Validators.required]],
    });

    this.department_dropdown_list();
    this.hospital_dropdown_list();
    this.get_User_List();
    this.usertype_dropdown_list();
    this.getDepartment_list();
    this.get_usermenu_List();
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

  validation: boolean = false;

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

  toggleConfirmPasswordVisibility = () => {
    this.confirmPasswordMode =
      this.confirmPasswordMode === 'password' ? 'text' : 'password';
  };

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

  

  onEditingStart(event: any) {
    event.cancel = true;

    this.formsource.reset({
      Inactive: '',
      AddInvoice: '',
      ViewInvoice: '',
      CancelInvoice: '',
    });

    this.fetch_selectedRow_Data(event);
    // this.editPopup = true;
  }

//   fetch_selectedRow_Data(e: any) {
//     const ID = e.data.ID;
//  this.isEditPopupLoading = true;
// this.editPopup = true;



//     this.dataservice.Select_UserData_Api(ID).subscribe((res: any) => {
//       // console.log(res, 'result');

//       this.selectedData = res.Data;
   

//       console.log('==selected data==', this.selectedData[0]);

//       this.selectedDepartmentId = this.selectedData[0].DEPARTMENT_ID;
     
// console.log('User data:', res.Data[0]);

//       this.formsource.patchValue({
//         ID: res.Data[0].ID,
//         Id: res.Data[0].ID,
//         UserName: res.Data[0].USER_NAME,
//         LoginName: res.Data[0].LOGIN_NAME,
//         LoginPassword: res.Data[0].LOGIN_PWD,
//         ConfirmPassword: res.Data[0].LOGIN_PWD, // Set the Discount value from your data
//         Inactive: res.Data[0].IS_INACTIVE,
//         UserType: res.Data[0].USER_TYPE,
//         HospitalId: res.Data[0].HOSPITAL_ID,
//         DepartmentId: parseInt(res.Data[0].DEPARTMENT_ID),
//         AddInvoice: res.Data[0].ADD_INVOICE,
//         ViewInvoice: res.Data[0].VIEW_INVOICE,
//         CancelInvoice: res.Data[0].CANCEL_INVOICE,
//         LastModifiedDate: res.Data[0].LAST_MODIFIED_DATE,
//         Menus: res.Data[0].MENUS,
//       });
//       console.log(this.DepartmentId,"department id");
      
//       this.username_value_edit = this.selectedData[0].USER_NAME;
//       console.log(this.username_value_edit);

//       this.selectedMenus = res.Data[0].MENUS.filter(
//         (m: any) => Number(m.SELECTED) === 1
//       );
//       this.selectedMenuIds = this.selectedMenus.map((m: any) => m.MENU_ID);
//  this.isEditPopupLoading = false;
//       // console.log(this.formsource.value);
//     });
//     this.selectedUserType = e.data.USER_TYPE;
//     // this.user_Id_value = e.data.USER_TYPE;
//     this.selectedHospitalId = e.data.HOSPITAL_ID;
//     this.editPopup = true;
//   }

async fetch_selectedRow_Data(e: any) {
  const ID = e.data.ID;
  this.isEditPopupLoading = true;
  this.editPopup = true;
  
  // Set these first for dropdown visibility
  this.selectedUserType = e.data.USER_TYPE;
  this.selectedHospitalId = e.data.HOSPITAL_ID;

  try {
    // Convert observable to promise with await
    const res: any = await this.dataservice.Select_UserData_Api(ID).toPromise();
    
    this.selectedData = res.Data;
    console.log('==selected data==', this.selectedData[0]);

    // Ensure department ID is properly typed (match department_list's ID type)
    const departmentId = res.Data[0].DEPARTMENT_ID;
    const formattedDeptId = this.department_list?.some(d => d.ID === departmentId) 
      ? departmentId 
      : parseInt(departmentId);

    this.formsource.patchValue({
      ID: res.Data[0].ID,
      UserName: res.Data[0].USER_NAME,
      LoginName: res.Data[0].LOGIN_NAME,
      LoginPassword: res.Data[0].LOGIN_PWD,
      ConfirmPassword: res.Data[0].LOGIN_PWD,
      Inactive: res.Data[0].IS_INACTIVE,
      UserType: res.Data[0].USER_TYPE,
      HospitalId: res.Data[0].HOSPITAL_ID,
      DepartmentId: formattedDeptId,  // Use the properly typed ID
      AddInvoice: res.Data[0].ADD_INVOICE,
      ViewInvoice: res.Data[0].VIEW_INVOICE,
      CancelInvoice: res.Data[0].CANCEL_INVOICE,
      LastModifiedDate: res.Data[0].LAST_MODIFIED_DATE,
      Menus: res.Data[0].MENUS,
    });

 this.selectedMenus = res.Data[0].MENUS.filter(
        (m: any) => Number(m.SELECTED) === 1
      );
      this.selectedMenuIds = this.selectedMenus.map((m: any) => m.MENU_ID);
 this.isEditPopupLoading = false;
    
    // Force update DevExtreme dropdown if needed
    await new Promise(resolve => setTimeout(resolve, 50));
    if (this.deptSelectBox) {
      this.deptSelectBox.instance.option('value', formattedDeptId);
    }

  } catch (error) {
    console.error('Error loading user data:', error);
  } finally {
    this.isEditPopupLoading = false;
  }
}


  //=======DROPDOWN=========
  department_dropdown_list() {
    this.dataservice
      .get_dropdowndepartment_api(name, this.hos_ID)
      .subscribe((res: any) => {
        console.log(res, '=========department_dropdown_list========');
        this.department_list = res;
        setTimeout(() => {
  this.formsource.patchValue({
    DepartmentId: parseInt(res.Data[0].DEPARTMENT_ID)
  });
});
      });
  }


  
  getDepartment_list() {
    this.dataservice.get_department_List().subscribe((res: any) => {
      console.log(res);

      // Add SlNo to each department item
      this.Department_Data = res.Data.map((item: any, index: number) => ({
        ...item,
        SlNo: index + 1,
      }));

      console.log(
        this.Department_Data,
        '======Department list with SlNo======'
      );

      //  // Filter based on selectedHospitalId or hos_ID
      // this.department_list = this.Department_Data.filter(
      //   (item) => item.HOSPITAL_ID == this.selectedHo );

      console.log(this.selectedHospitalId, 'Selected Hospital ID');
      console.log(this.department_list, 'Filtered Department List');
      console.log(this.selectedHospitalId);
      console.log(
        this.Department_Data.filter((item) => item.HOSPITAL_ID == this.hos_ID)
      );
    });
  }

  hospital_dropdown_list() {
    this.dataservice.get_dropdown_hospital_api(name).subscribe((res: any) => {
      console.log(res, '==============hospital dropdown list=======');
      this.hospital_list = res;
    });
  }

  onUserTypeChange(event: any) {
    console.log(event, 'onUserTypeChange');
    this.selectedUserType = event.value;
    console.log(this.selectedUserType, 'this.selectedUserType');
  }
  usertype_dropdown_list() {
    this.dataservice.get_dropdown_User_Api(name).subscribe((res: any) => {
      console.log(res, '=========department_dropdown_list========');
      this.usertype_list = res;
    });
  }

  onHospitalValue(event: any) {
    this.selectedHospitalId = event.value;
    this.hos_ID = event.value;
    this.department_dropdown_list();
    console.log(this.selectedHospitalId, '=============Hospital I D=======');
    // console.log(this.hospital_list,'hospital list');
  }
  get_User_List() {
    console.log('get_User_List');

    this.dataservice.get_UserData_List_Api().subscribe((response: any) => {
      console.log('get_User_List', response);

      if (response) {
        this.dataSource = response.Data.map((item: any, index: any) => ({
          ...item,
          SlNo: index + 1, // Assign serial number
        }));
        // console.log(response.data);
      }
    });
  }

  get_usermenu_List() {
    const userId = 0;

    this.dataservice.get_usermenu_Api(userId).subscribe((response: any) => {
      // console.log(response,'usermenu response');
      this.Usermenu = response;
      console.log(this.Usermenu, 'usermenu response');
    });
  }

  //============ change the format of menu item list to the plan structure =========
  // transformMenuToFlatTreeWithContinuousIDs(data) {
  //   const result = [];
  //   const mainMenuMap = new Map();
  //   let currentId = 1;

  //   data.forEach((item) => {
  //     if (!mainMenuMap.has(item.MAIN_MENU_ID)) {
  //       mainMenuMap.set(item.MAIN_MENU_ID, currentId);
  //       result.push({
  //         ID: currentId,
  //         Head_ID: null,
  //         Name: item.MAIN_MENU_NAME,
  //         Main_Name: item.MAIN_MENU_NAME,
  //         Selected: 0,
  //       });
  //       currentId++;
  //     }
  //   });

  //   data.forEach((item) => {
  //     result.push({
  //       ID: currentId,
  //       Head_ID: mainMenuMap.get(item.MAIN_MENU_ID),
  //       Name: item.MENU_NAME,
  //       Main_Name: item.MAIN_MENU_NAME,
  //       Selected: item.SELECTED,
  //     });
  //     currentId++;
  //   });

  //   return result;
  // }

 onSelectionChanged(e: any) {
  const selectedKeys = e.component.getSelectedRowKeys(); // Selected IDs (parent or child)
  const allKeys = this.getRecursiveSelectedKeys(selectedKeys); // Includes all children

  const leafOnlyKeys = this.getOnlyLeafNodes(allKeys); // ✅ Remove parent nodes

  this.selectedKeys = leafOnlyKeys;
  this.formsource.get('Menu')?.setValue(leafOnlyKeys);
  console.log('Selected Leaf (Child) MENU_IDs:', leafOnlyKeys);
}



getRecursiveSelectedKeys(selectedKeys: any[]): any[] {
  const selectedSet = new Set(selectedKeys);
  const allKeys = [...selectedKeys];

  for (const key of selectedKeys) {
    this.collectChildrenRecursively(key, allKeys, selectedSet);
  }

  return Array.from(new Set(allKeys)); // remove duplicates
}

collectChildrenRecursively(parentId: any, result: any[], visited: Set<any>) {
  const children = this.Usermenu.filter(item => item.MAIN_MENU_ID === parentId);

  for (const child of children) {
    if (!visited.has(child.MENU_ID)) {
      visited.add(child.MENU_ID);
      result.push(child.MENU_ID);
      this.collectChildrenRecursively(child.MENU_ID, result, visited);
    }
  }
}

getOnlyLeafNodes(menuIds: any[]): any[] {
  return menuIds.filter(id => {
    const isParent = this.Usermenu.some(item => item.MAIN_MENU_ID === id);
    return !isParent; // keep only items with no children
  });
}



  validatePasswordMatch(): boolean {
  const password = this.formsource.get('LoginPassword')?.value;
  const confirmPassword = this.formsource.get('ConfirmPassword')?.value;
  return password === confirmPassword;
}


  addData() {
    // this.validation = true;
    const validationResult = this.formValidationGroup?.instance?.validate(); // Call DevExtreme validation
    console.log('Button Clicked');
    console.log(this.formsource, 'reset');
    const Login_name = this.formsource.get('LoginName')?.value;
    const User_name = this.formsource.get('UserName')?.value;
    const Login_password = this.formsource.get('LoginPassword')?.value;
    const Is_Inactive = this.formsource.get('Inactive')?.value === true;
    const Department_Id =
      this.selectedDepartmentId != null
        ? this.selectedDepartmentId.toString()
        : '';

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
    const Last_modified_date = new Date(); // sends full JS object, not valid JSON
    // const Menu = this.selectedKeys.toString();
  // const Menu = this.formsource.get('Menu').toString();
  // const Menu = this.selectedKeys.toString();
  const Menu = this.selectedKeys ? this.selectedKeys.toString() : '';

    console.log(Menu);

    // const Menus = this.formsource.get('Menus')?.value;
    console.log(
      Login_name,
      User_name,
      Login_password,
      Is_Inactive,
      Department_Id,
      Hospital_Id,
      Usertype,
      Add_invoice,
      View_invoice,
      Cancel_invoice,
      Last_modified_date,
      Menu,
      'add data'
    );

    const payload = {
      // or dynamic: this.loggedInUser
      USER: 'admin', // ✅ Add this line
      USER_NAME: User_name,
      LOGIN_NAME: Login_name,
      LOGIN_PWD: Login_password,
      USER_TYPE: Usertype,
      IS_INACTIVE: Is_Inactive,
      DEPARTMENT_ID: Department_Id,
      HOSPITAL_ID: Hospital_Id,
      ADD_INVOICE: Add_invoice,
      VIEW_INVOICE: View_invoice,
      CANCEL_INVOICE: Cancel_invoice,
      LAST_MODIFIED_USER: 1,
      LAST_MODIFIED_DATE: Last_modified_date,
      // MENUS : Menus
      MENUS: Menu,
    };

    if (!Menu || Menu.length === 0) {
   const confirmed = confirm('You have not selected any menu.\nDo you want to continue without selecting?');
    if (!confirmed) {
      return; // ❌ Cancel pressed
    }
  }
    

    // 🚫 New condition: Hospital User must select hospital
    if (Usertype === 3 && !Hospital_Id) {
      notify(
        {
          message: 'Please select the hospital',
          position: { at: 'top right', my: 'top right' },
          displayTime: 1500,
        },
        'error'
      );
      return;
    }


    // 🚫 New condition: Hospital User must select hospital
    if (Usertype === 4 && !Department_Id) {
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
      return data.LOGIN_NAME?.trim().toLowerCase() === Login_name.toLowerCase();
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
    console.log(payload, 'PAYLOAD');


    
    if (Login_name && User_name && Login_password && Usertype) {
      this.dataservice.Insert_User_Api(payload).subscribe((res: any) => {
        console.log(res, 'insert response');

        console.log('function called');
       

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

  openPopup =()=> {
    this.addPopup = true;
    this.validation = false;

     this.isEditPopupLoading = true;
    setTimeout(() => {
    this.formValidationGroup?.instance?.reset();
  });
    this.formsource.reset({
      Inactive: '',
      AddInvoice: '',
      ViewInvoice: '',
      CancelInvoice: '',
      DepartmentId: null,
      HospitalId: '',
       Menu: []  // If this field exists in formsource
    });
     // ✅ Step 2: Clear internal menu selection
  this.selectedMenuIds = [];

  // ✅ Step 3: Ensure TreeList clears visually
  setTimeout(() => {
    this.treeListMenu?.instance?.clearSelection();  // remove UI selection
    this.treeListMenu?.instance?.refresh();         // redraw if needed
  }, 50); // slight delay ensures component is initialized

  // ✅ Step 4: Reset validation (optional)
  setTimeout(() => {
    this.formValidationGroup?.instance?.reset();
  }, 100);
}

  onAddPopupClose() {
    this.formsource.reset();
    this.dxFormInstance?.instance?.resetValidation();
    this.selectedUserType = null;
  }

  editData() {
    console.log('Edit Button Clicked');
const validationResult = this.formValidationGroup?.instance?.validate();
    // Extract values from the form
    const Id = this.formsource.get('ID')?.value;
    const Login_name = this.formsource.get('LoginName')?.value?.trim();
    const User_name = this.formsource.get('UserName')?.value?.trim();
    const Login_password = this.formsource.get('LoginPassword')?.value?.trim();
    const Is_Inactive = this.formsource.get('Inactive')?.value === true;
    const Department_Id = this.formsource.get('DepartmentId')?.value.toString()
    // const Department_Id = this.selectedDepartmentId.toString();
    // const Department_Id =
    //   this.selectedDepartmentId != null
    //     ? this.selectedDepartmentId.toString()
    //     : '';
    // const Hospital_Id = this.selectedHospitalId;
    const Hospital_Id = Array.isArray(this.selectedHospitalId)
      ? Number(this.selectedHospitalId[0]) || 0
      : Number(this.selectedHospitalId) || 0;
    const Usertype = this.selectedUserType;
    const Add_invoice = this.formsource.get('AddInvoice')?.value === true;
    const View_invoice = this.formsource.get('ViewInvoice')?.value === true;
    const Cancel_invoice = this.formsource.get('CancelInvoice')?.value === true;
    const Last_modified_date = new Date(); // sends full JS object, not valid JSON

    // const Menu = this.selectedKeys.toString();
    const Menu = this.selectedKeys ? this.selectedKeys.toString() : '';


    // Debug log
    console.log(
      {
        Id,
        Login_name,
        User_name,
        Login_password,
        Is_Inactive,
        Department_Id,
        Hospital_Id,
        Usertype,
        Add_invoice,
        View_invoice,
        Cancel_invoice,
        Last_modified_date,
        Menu,
      },
      'Edit Data Payload'
    );

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
      HOSPITAL_ID: Hospital_Id,
      ADD_INVOICE: Add_invoice,
      VIEW_INVOICE: View_invoice,
      CANCEL_INVOICE: Cancel_invoice,
      LAST_MODIFIED_USER: 1,
      LAST_MODIFIED_DATE: Last_modified_date,
      // MENUS : Menus
      // MENUS: Menus || []
      MENUS: Menu,
    };


     if (!Menu || Menu.length === 0) {
   const confirmed = confirm('You have not selected any menu.\nDo you want to continue without selecting?');
    if (!confirmed) {
      return; // ❌ Cancel pressed
    }
  }

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
      notify(
        {
          message: 'Please select the hospital',
          position: { at: 'top right', my: 'top right' },
          displayTime: 1500,
        },
        'error'
      );
      return;
    }



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
      return (
        data.LOGIN_NAME?.trim().toLowerCase() === Login_name.toLowerCase() &&
        data.ID !== Id
      );
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

  deleteData(event: any) {
    if (event.data.USERTYPE === 1) {
      event.cancel = true;
      notify(
        {
          message: 'Admin users cannot be deleted.',
          position: { at: 'top right', my: 'top right' },
          displayTime: 500,
        },
        'error'
      );
      return;
    }

    const ID = event.data.ID;

    if (ID) {
      this.dataservice.Delete_User_Api(ID).subscribe((response: any) => {
        console.log(response, 'delete response');
        notify(
          {
            message: 'Data succesfully deleted',
            position: { at: 'top right', my: 'top right' },
            displayTime: 500,
          },
          'success'
        );
      });
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
    DxValidationGroupModule,
    DxLoadPanelModule,
    DxLoadIndicatorModule
  ],
  providers: [],
  exports: [UserListComponent],
  declarations: [UserListComponent],
})
export class UserListModule {}
