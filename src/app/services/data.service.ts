import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

const BASE_URL = environment.VEZTA_BILLING_API_BASE_URL;

const Token = JSON.parse(localStorage.getItem('Token'));

@Injectable()
export class DataService {
  exportDataGrid(event: any, fileName: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient, private router: Router) {}

  //=================DAte format changing to needed format========
  formatDateTime(date: string): string {
    return formatDate(new Date(date), 'dd-MMM-yyyy hh:mm a', 'en-US');
  }

  //===============Fetch claim details drill down values===========
  // set_pageLoading_And_Closing_Log(Action: any, PageName: any) {
  //   const userid = sessionStorage.getItem('UserID');
  //   const currentPathName = PageName;
  //   const TOKEN = JSON.parse(localStorage.getItem('logData')).Token;
  //   const url = `${BASE_URL}user/useractivity`;
  //   const reqBody = {
  //     USER_ID: userid,
  //     TITLE: currentPathName,
  //     ACTION: Action,
  //     TOKEN: TOKEN,
  //   };
  //   return this.http.post(url, reqBody);
  // }

  // set_pageLoading_And_Closing_Log(Action: any, PageName: any) {
  //   const userid = sessionStorage.getItem('UserID');
  //   const currentPathName = PageName;

  //   // Retrieve userData instead of logData
  //   const userDataString = localStorage.getItem('userData');
  //   if (!userDataString) {
  //     console.error('userData is null. Cannot proceed.');
  //     return;
  //   }

  //   const userData = JSON.parse(userDataString);
  //   const userID = userData?.ID; // Use the correct property name

  //   if (!userID) {
  //     console.error('User ID is missing in userData.');
  //     return;
  //   }

  //   const url = `${BASE_URL}user/useractivity`;
  //   const reqBody = {
  //     USER_ID: userID,
  //     TITLE: currentPathName,
  //     ACTION: Action,
  //   };

  //   return this.http.post(url, reqBody);
  // }

  // //Invoice - Sales
  // getInvoiceList(
  //   orgId: string,
  //   dateFrom: string,
  //   dateTo: string
  // ): Observable<any> {
  //   const payload = {
  //     OrgID: orgId,
  //     DateFrom: dateFrom,
  //     DateTo: dateTo,
  //   };

  //   return this.http.post(`${BASE_URL}/organization/invoices`, payload);
  // }

  //dropdown

  public getDropdownData(type: any): Observable<any> {
    const reqBodyData = { name: type };
    return this.http.post(`${BASE_URL}dropdown/`, reqBodyData);
  }

  getInvoiceList(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}invoice/list`, data);
  }
  getInvoiceNo(data: any): Observable<any> {
    // const data = { "DEPARTMENT_ID":1}
    return this.http.post(`${BASE_URL}invoice/BillNo`, data);
  }

  saveInvoiceData(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}invoice/insert`, data);
  }

  getItemsData(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}invoice/getitemsData`, data);
  }
  getWardAndUnit(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}invoice/getWardnUnit`, data);
  }

  //SCHEMA-LIST

  getSchema(): Observable<any> {
    return this.http.post(`${BASE_URL}Schema/list`, {});
  }

  //dropdown

  public getDrodownData(type: any): Observable<any> {
    const reqBodyData = { name: type };
    return this.http.post(`${BASE_URL}dropdown/`, reqBodyData);
  }

  //===========================Department Api=========================
  //======================Department list=============================
  get_department_List() {
    return this.http.post(`${BASE_URL}department/list`, {});
  }
  //===========================Select Api =============================
  select_department_Details(id: any) {
    return this.http.post(`${BASE_URL}department/select/${id}`, {});
  }

  //=====================Dropdown======================

  get_dropdown_hospital_api(type: any) {
    const reqBody = {
      NAME: 'Hospital',
    };

    return this.http.post(`${BASE_URL}dropdown`, reqBody);
  }

//=======================Add Data=========================

  Add_Department_Api(department: any, Hospital, is_Inactive: any,Bill_prefix:any) {
    const reqBody = {
      DEPARTMENT: department,
      HOSPITAL_ID: Hospital,
      IS_INACTIVE: is_Inactive,
      BILL_PREFIX:Bill_prefix
    };
    return this.http.post(`${BASE_URL}department/insert`, reqBody);
  }

//========================Update department data==================

  Update_Department_Api(id:any,department: any, Hospital, is_Inactive: any,Bill_prefix:any) {
    const reqBody = {
      ID:id,
      DEPARTMENT: department,
      HOSPITAL_ID: Hospital,
      IS_INACTIVE: is_Inactive,
      BILL_PREFIX:Bill_prefix
    };
    return this.http.post(`${BASE_URL}department/update`, reqBody);
  }


  delete_department_api(id: any) {
    return this.http.post(`${BASE_URL}department/delete/${id}`, {});
  }

  //====================department dropdown===========================
  // get_dropdown_department_api(type: any) {
//=====================item Api=============================
//====================department dropdown===========================
    get_dropdown_department_api(type: any) {
    const reqBody = {
      NAME: 'Department',
    };

    return this.http.post(`${BASE_URL}dropdown`, reqBody);
  }
  //HOSPITAL
  get_HospitalData_List() {
    return this.http.post(`${BASE_URL}hospital/list`, {});
  }

  // Insert_HospitalData_Api(hospital: any, IS_INACTIVE: any) {
  //   const getEndpoint = BASE_URL + 'hospital/insert';
  //   const reqBody = {
  //     HOSPITAL_NAME: hospital,
  //     IS_INACTIVE: IS_INACTIVE,
  //   };

  //   return this.http.post(getEndpoint, reqBody);
  // }

  Update_HospitalData_Api(ID: any, Hospital: any, IS_INACTIVE: any) {
    const getEndpoint = BASE_URL + 'hospital/update';
    const reqBody = {
      ID: ID,
      HOSPITAL_NAME: Hospital,
      IS_INACTIVE: IS_INACTIVE,
    };

    return this.http.post(getEndpoint, reqBody);
  }

  Select_HospitalData_Api(ID: any) {
    const getEndpoint = BASE_URL + `hospital/select/${ID}`;
    return this.http.post(getEndpoint, {});
  }

  // Delete_Hospital_Api(ID: any) {
  //   const getEndpoint = BASE_URL + `hospital/delete/${ID}`;
  //   return this.http.post(getEndpoint, {});
  // }

  //=====================get item list===============================
get_ItemsData_List(){
  return this.http.post( `${BASE_URL}Items/list`,{} );
}

select_items_Data(id:any){
    return this.http.post(`${BASE_URL}Items/select/${id}`, {});
}
//=============Add items================================================
add_items_api(item_code:any,name:any,is_fixed:any,item_price:any,is_inactive,dep_id:any){
  const reqBody = {
     ITEM_CODE: item_code,
  ITEM_NAME: name,
  IS_FIXED_PRICE: is_fixed,
  PRICE: item_price,
  IS_INACTIVE: is_inactive,
  DEPARTMENT_ID:dep_id,

    };
    return this.http.post(`${BASE_URL}items/insert`, reqBody);

}

delete_items_api(id:any){

   return this.http.post(`${BASE_URL}items/delete/${id}`, {});

}
//=====================update items===================
 update_items_Api(id:any,item_code:any,name:any,is_fixed:any,item_price:any,is_inactive,dep_id:any){
  const reqBody =
{
  ID:id,
ITEM_CODE: item_code,
ITEM_NAME: name,
IS_FIXED_PRICE: is_fixed,
PRICE: item_price,
IS_INACTIVE: is_inactive,
DEPARTMENT_ID: dep_id
}
return this.http.post(`${BASE_URL}Items/update`,reqBody);
 }

// get_HospitalData_List(){
//   return this.http.post( `${BASE_URL}hospital/list`,{} );
// }

Insert_HospitalData_Api( Hospital:any, IS_INACTIVE:any) {
  const getEndpoint = BASE_URL+`hospital/insert`;
  const reqBody={
   
   "HOSPITAL_NAME": Hospital,
   "IS_INACTIVE":IS_INACTIVE
}

  return this.http.post(getEndpoint, reqBody);
}

//=====================api for update hospital==========================

// Update_HospitalData_Api(ID:any,Hospital:any,IS_INACTIVE:any){
//   const getEndpoint = BASE_URL+`hospital/update`;
//   const reqBody={

// "ID":ID,
// "HOSPITAL_NAME": Hospital,
// "IS_INACTIVE": IS_INACTIVE

// };

//   return this.http.post(getEndpoint, reqBody);
// }

//=====================api for select hospital==========================
// Select_HospitalData_Api(ID:any){
//   const getEndpoint = BASE_URL+`hospital/select/${ID}`;
//   return this.http.post(getEndpoint,{});
// }

Delete_Hospital_Api(ID:any){
  const getEndpoint = BASE_URL+`hospital/delete/${ID}`;
  return this.http.post(getEndpoint,{});
}


//=============INSURANCE===================
get_InsuranceData_List(){
  return this.http.post( `${BASE_URL}Insurance/list`,{} );
}

Insert_InsuranceData_Api( Insurance:any, IS_INACTIVE:any) {
  const getEndpoint = BASE_URL+'Insurance/insert';
  const reqBody={
   
   "INSURANCE_NAME": Insurance,
   "IS_INACTIVE":IS_INACTIVE
}
  return this.http.post(getEndpoint, reqBody);
}

Update_InsuranceData_Api(ID:any, Insurance:any, IS_INACTIVE:any){
const getEndpoint = BASE_URL+'Insurance/update';
  const reqBody={
"ID":ID,
"INSURANCE_NAME": Insurance,
"IS_INACTIVE": IS_INACTIVE

};

  return this.http.post(getEndpoint, reqBody);
}

Select_InsuranceData_Api(ID:any){
  const getEndpoint = BASE_URL+`Insurance/select/${ID}`;
  return this.http.post(getEndpoint,{});
}

Delete_Insurance_Api(ID:any){
  const getEndpoint = BASE_URL+`Insurance/delete/${ID}`;
  return this.http.post(getEndpoint,{});
}



//===============USER=======================
// get_UserData_List(){
//   return this.http.post( `${BASE_URL}user/list`,{} );
// }

//======================SCHEMA=========================
get_SchemaData_List(){
  return this.http.post( `${BASE_URL}Schema/list`,{} );
}

Insert_SchemaData_Api( Schema:any,Discount:any, IS_INACTIVE:any) {
  const getEndpoint = BASE_URL+'Schema/insert';
  const reqBody={
   
   "SCHEMA_NAME": Schema,
    "DISCOUNT": Discount,
   "IS_INACTIVE":IS_INACTIVE
}
  return this.http.post(getEndpoint, reqBody);
}

Update_SchemaData_Api(ID:any, Schema:any,Discount:any ,IS_INACTIVE:any){
const getEndpoint = BASE_URL+`Schema/update`;
  const reqBody={
"ID":ID,
"SCHEMA_NAME": Schema,
"DISCOUNT": Discount,
"IS_INACTIVE": IS_INACTIVE

};

  return this.http.post(getEndpoint, reqBody);
}

Select_SchemaData_Api(ID:any){
  const getEndpoint = BASE_URL+`Schema/select/${ID}`;
  return this.http.post(getEndpoint,{});
}

Delete_Schema_Api(ID:any){
  const getEndpoint = BASE_URL+`Schema/delete/${ID}`;
  return this.http.post(getEndpoint,{});
}

//=====================USER==========================
//====================department dropdown===========================
  
}

