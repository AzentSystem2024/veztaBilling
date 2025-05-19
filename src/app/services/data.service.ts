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

//SCHEMA-LIST

getSchema(): Observable<any> {
  return this.http.post(`${BASE_URL}Schema/list`, {});
}

  //dropdown

public getDrodownData(type: any): Observable<any> {
  const reqBodyData = { name: type };
  return this.http.post(
    `${BASE_URL}dropdown/`,
    reqBodyData
  );
}

  //HOSPITAL

  // get_HospitalData_List() {
  //   const getEndpoint = BASE_URL+'/hospital/list';
  //   return this.http.post(getEndpoint, {});
  // }

  // Insert_HospitalData_Api(ID:any, hospital:any, IS_INACTIVE:any) {
  //   const getEndpoint = BASE_URL+'hospital/save';
  //   const reqBody={
  //    "ID": ID,
  //    "HOSPITAL_NAME": hospital,
  //    "IS_INACTIVE":IS_INACTIVE
  // }

  //   return this.http.post(getEndpoint, reqBody);
  // }

  // Update_HospitalData_Api(ID:any, Hospital:any, IS_INACTIVE:any){
  // const getEndpoint = BASE_URL+'hospital/update';
  //   const reqBody={

  // "ID":ID,
  // "HOSPITAL": Hospital,
  // "IS_INACTIVE": IS_INACTIVE

  // };

  //   return this.http.post(getEndpoint, reqBody);
  // }

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

  Add_Department_Api(department: any, Hospital, is_Inactive: any) {
    const reqBody = {
      DEPARTMENT: department,
      HOSPITAL: Hospital,
      IS_INACTIVE: is_Inactive,
    };
    return this.http.post(`${BASE_URL}department/insert`, reqBody);
  }

  delete_department_api(id: any) {
    return this.http.post(`${BASE_URL}department/delete/${id}`, {});
  }


//====================department dropdown===========================
    get_dropdown_department_api(type: any) {
    const reqBody = {
      NAME: 'Department',
    };

    return this.http.post(`${BASE_URL}dropdown`, reqBody);
  }
//HOSPITAL
get_HospitalData_List(){
  return this.http.post( `${BASE_URL}hospital/list`,{} );
}

Insert_HospitalData_Api( hospital:any, IS_INACTIVE:any) {
  const getEndpoint = BASE_URL+'hospital/insert';
  const reqBody={
   
   "HOSPITAL_NAME": hospital,
   "IS_INACTIVE":IS_INACTIVE
}

  return this.http.post(getEndpoint, reqBody);
}

Update_HospitalData_Api(ID:any, Hospital:any, IS_INACTIVE:any){
const getEndpoint = BASE_URL+'hospital/update';
  const reqBody={

"ID":ID,
"HOSPITAL_NAME": Hospital,
"IS_INACTIVE": IS_INACTIVE

};

  return this.http.post(getEndpoint, reqBody);
}

Select_HospitalData_Api(ID:any){
  const getEndpoint = BASE_URL+`hospital/select/${ID}`;
  return this.http.post(getEndpoint,{});
}

Delete_Hospital_Api(ID:any){
  const getEndpoint = BASE_URL+`hospital/delete/${ID}`;
  return this.http.post(getEndpoint,{});
}

}
