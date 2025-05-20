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
  
  
  getResellerList(): Observable<any> {
    return this.http.post(`${BASE_URL}/reseller/list`, {});
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

  //dropdown

public getDropdownData(type: any): Observable<any> {
  const reqBodyData = { name: type };
  return this.http.post(
    `${BASE_URL}dropdown/`,
    reqBodyData
  );
}

//========================HOSPITAL=========================
get_HospitalData_List(){
  return this.http.post( `${BASE_URL}hospital/list`,{} );
}

Insert_HospitalData_Api( Hospital:any, IS_INACTIVE:any) {
  const getEndpoint = BASE_URL+`hospital/insert`;
  const reqBody={
   
   "HOSPITAL_NAME": Hospital,
   "IS_INACTIVE":IS_INACTIVE
}

  return this.http.post(getEndpoint, reqBody);
}

//=====================api for update hospital==========================

Update_HospitalData_Api(ID:any,Hospital:any,IS_INACTIVE:any){
  const getEndpoint = BASE_URL+`hospital/update`;
  const reqBody={

"ID":ID,
"HOSPITAL_NAME": Hospital,
"IS_INACTIVE": IS_INACTIVE

};

  return this.http.post(getEndpoint, reqBody);
}

//=====================api for select hospital==========================
Select_HospitalData_Api(ID:any){
  const getEndpoint = BASE_URL+`hospital/select/${ID}`;
  return this.http.post(getEndpoint,{});
}

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
    get_dropdown_department_api(type: any) {
    const reqBody = {
      NAME: 'Department',
    };

    return this.http.post(`${BASE_URL}dropdown`, reqBody);
  }

}
