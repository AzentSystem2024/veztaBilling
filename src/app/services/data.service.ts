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
  public insertReseller(
    RESELLER_CODE: any,
    RESELLER_NAME: any,
    RESELLER_PHONE: any,
    RESELLER_EMAIL,
    COUNTRY_ID,
    LOGIN_NAME,
    PASSWORD
  ): Observable<any> {
    const data = {
      RESELLER_CODE,
      RESELLER_NAME,
      RESELLER_PHONE,
      RESELLER_EMAIL,
      COUNTRY_ID,
      LOGIN_NAME,
      PASSWORD,
    };

    return this.http.post(`${BASE_URL}/reseller/insert`, data);
  }

  selectReseller(id: number): Observable<any> {
    return this.http.post(`${BASE_URL}reseller/select/${id}`, {});
  }

  updateReseller(id: number, reseller: object): Observable<any> {
    const payload = { id, ...reseller };
    return this.http.post<any>(`${BASE_URL}/reseller/update`, payload);
  }

  deleteReseller(
    ID: any,
    RESELLER_CODE: any,
    RESELLER_NAME: any,
    RESELLER_PHONE: any,
    RESELLER_EMAIL,
    COUNTRY_ID,
    LOGIN_NAME,
    PASSWORD
  ) {
    const requestBody = {
      RESELLER_CODE: RESELLER_CODE,
      RESELLER_NAME: RESELLER_NAME,
      RESELLER_PHONE: RESELLER_PHONE,
      RESELLER_EMAIL: RESELLER_EMAIL,
      COUNTRY_ID: COUNTRY_ID,
      LOGIN_NAME: LOGIN_NAME,
      PASSWORD: PASSWORD,
    };
    return this.http.post<any>(
      `${BASE_URL}/reseller/delete/` + ID,
      requestBody
    );
  }

  //CUSTOMER

  getCustomerList(): Observable<any> {
    return this.http.post(`${BASE_URL}/customers/list`, {});
  }

  public insertCustomer(
    CUST_CODE: any,
    CUST_NAME: any,
    CONTACT_NAME: any,
    ADDRESS,
    PHONE,
    EMAIL,
    REGD_DATE,
    RESELLER_ID,
    LOGIN_NAME,
    PASSWORD,
    IS_INACTIVE
  ): Observable<any> {
    const data = {
      CUST_CODE,
      CUST_NAME,
      CONTACT_NAME,
      ADDRESS,
      PHONE,
      EMAIL,
      REGD_DATE,
      RESELLER_ID,
      LOGIN_NAME,
      PASSWORD,
      IS_INACTIVE,
    };

    return this.http.post(`${BASE_URL}customers/insert`, data);
  }

  selectCustomer(id: number): Observable<any> {
    return this.http.post(`${BASE_URL}customers/select/${id}`, {});
  }

  updateCustomer(id: number, customer: object): Observable<any> {
    const payload = { id, ...customer };
    return this.http.post<any>(`${BASE_URL}/customers/update`, payload);
  }

  deleteCustomer(
    ID: any,
    CUST_CODE: any,
    CUST_NAME: any,
    CONTACT_NAME: any,
    ADDRESS,
    PHONE,
    EMAIL,
    REGD_DATE,
    RESELLER_ID,
    LOGIN_NAME,
    PASSWORD,
    IS_INACTIVE
  ) {
    const requestBody = {
      CUST_CODE: CUST_CODE,
      CUST_NAME: CUST_NAME,
      CONTACT_NAME: CONTACT_NAME,
      ADDRESS: ADDRESS,
      PHONE: PHONE,
      EMAIL: EMAIL,
      REGD_DATE: REGD_DATE,
      RESELLER_ID: RESELLER_ID,
      LOGIN_NAME: LOGIN_NAME,
      PASSWORD: PASSWORD,
      IS_INACTIVE: IS_INACTIVE,
    };
    return this.http.post<any>(
      `${BASE_URL}/customers/delete/` + ID,
      requestBody
    );
  }

  //USER

  getUserList(): Observable<any> {
    return this.http.post(`${BASE_URL}user/list`, {});
  }

  public insertUser(
    USER_NAME,
    LOGIN_NAME,
    PASSWORD,
    IS_INACTIVE,
    USER_TYPE
  ): Observable<any> {
    const data = {
      USER_NAME: USER_NAME,
      LOGIN_NAME: LOGIN_NAME,
      PASSWORD: PASSWORD,
      IS_INACTIVE: IS_INACTIVE,
      USER_TYPE: USER_TYPE,
    };

    return this.http.post(`${BASE_URL}user/insert`, data);
  }

  selectUser(id: number): Observable<any> {
    return this.http.post(`${BASE_URL}user/select/${id}`, {});
  }

  updateUser(id: number, user: object): Observable<any> {
    const payload = { id, ...user };
    return this.http.post<any>(`${BASE_URL}user/update`, payload);
  }

  deleteUser(ID: any, USER_NAME, LOGIN_NAME, PASSWORD, IS_INACTIVE) {
    const requestBody = {
      USER_NAME,
      LOGIN_NAME,
      PASSWORD,
      IS_INACTIVE,
    };
    return this.http.post<any>(`${BASE_URL}user/delete/` + ID, requestBody);
  }

  //ORGANIZATION

  getOrganizationList(): Observable<any> {
    return this.http.post(`${BASE_URL}organization/list`, {});
  }

  public insertOrganization(
    CUST_ID,
    ORG_CODE,
    ORG_NAME,
    LOCATION,
    ORG_TRN,
    ORG_CR,
    ORG_KEY,
    CSR,
    PRIVATE_KEY,
    PUBLIC_KEY,
    SECRET_KEY,
    COMMON_NAME,
    SERIAL_NO,
    REGD_DATE,
    EXPIRY_DATE,
    IS_INACTIVE,
    CREAT_NEW_LICENSE,
    USER_ID
  ): Observable<any> {
    const data = {
      CUST_ID: CUST_ID,
      ORG_CODE: ORG_CODE,
      ORG_NAME: ORG_NAME,
      LOCATION: LOCATION,
      ORG_TRN: ORG_TRN,
      ORG_CR: ORG_CR,
      ORG_KEY: ORG_KEY,
      CSR: CSR,
      PRIVATE_KEY: PRIVATE_KEY,
      PUBLIC_KEY: PUBLIC_KEY,
      SECRET_KEY: SECRET_KEY,
      COMMON_NAME: COMMON_NAME,
      SERIAL_NO: SERIAL_NO,
      REGD_DATE: REGD_DATE,
      EXPIRY_DATE: EXPIRY_DATE,
      IS_INACTIVE: IS_INACTIVE,
      CREAT_NEW_LICENSE: CREAT_NEW_LICENSE,
      USER_ID: USER_ID,
    };

    return this.http.post(`${BASE_URL}organization/insert`, data);
  }

  selectOrganization(id: number): Observable<any> {
    return this.http.post(`${BASE_URL}organization/select/${id}`, {});
  }

  deleteOrganization(
    ID: any,
    CUST_ID,
    ORG_CODE,
    ORG_NAME,
    LOCATION,
    ORG_TRN,
    ORG_CR,
    ORG_KEY,
    CSR,
    PRIVATE_KEY,
    PUBLIC_KEY,
    SECRET_KEY,
    COMMON_NAME,
    SERIAL_NO,
    REGD_DATE,
    EXPIRY_DATE,
    IS_INACTIVE
  ) {
    const requestBody = {
      CUST_ID,
      ORG_CODE,
      ORG_NAME,
      LOCATION,
      ORG_TRN,
      ORG_CR,
      ORG_KEY,
      CSR,
      PRIVATE_KEY,
      PUBLIC_KEY,
      SECRET_KEY,
      COMMON_NAME,
      SERIAL_NO,
      REGD_DATE,
      EXPIRY_DATE,
      IS_INACTIVE,
    };
    return this.http.post<any>(
      `${BASE_URL}organization/delete/` + ID,
      requestBody
    );
  }

  updateOrganization(organization: object, id: number): Observable<any> {
    const payload = { ID: id, ...organization }; // Use 'ID' instead of 'id'
    return this.http.post<any>(`${BASE_URL}organization/update`, payload);
  }

  //license renewal
  renewLicense(
    userId: number,
    licenses: { ORG_ID: number; NEW_EXPIRY_DATE: string }[]
  ): Observable<any> {
    const requestData = {
      USER_ID: userId,
      license: licenses,
    };
    return this.http.post(`${BASE_URL}/organization/licenserenew`, requestData);
  }

  //Invoice - Sales
  getInvoiceList(
    orgId: string,
    dateFrom: string,
    dateTo: string
  ): Observable<any> {
    const payload = {
      OrgID: orgId,
      DateFrom: dateFrom,
      DateTo: dateTo,
    };

    return this.http.post(`${BASE_URL}/organization/invoices`, payload);
  }

  //dropdown

  public getDropdownData(type: any): Observable<any> {
    const reqBodyData = { name: type };
    return this.http.post(`${BASE_URL}/dropdown/`, reqBodyData);
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

}
