import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxSelectBoxModule } from 'devextreme-angular';
import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule,  } from './layouts';
import {
  AppFooterModule,
  AppHeaderModule,
  
  
} from './components';
import { HttpClientModule } from '@angular/common/http';
import { AuthService, ScreenService, AppInfoService } from './services';
import { UnauthenticatedContentModule } from './layouts/unauthenticated-content/unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { ThemeService } from './services';
import { DxFormModule } from 'devextreme-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskListModule } from 'src/app/components/library/task-list-grid/task-list-grid.component';

import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './custom-reuse-strategy';
import { DashboardModule } from './pages/HOME/dashboard/dashboard.component';
import { LoginFormModule } from './components/Login/login-form/login-form.component';
import { UserListComponent, UserListModule } from './pages/MASTER PAGES/userFiles/user-list/user-list.component';

import { InvoiceListComponent, InvoiceListModule } from './pages/MASTER PAGES/invoiceFiles/invoice-list/invoice-list.component';

import { HospitalListComponent } from './pages/MASTER PAGES/hospitalFiles/hospital-list/hospital-list.component';
import { HospitalListModule } from './pages/MASTER PAGES/hospitalFiles/hospital-list/hospital-list.component';

;

import { InvoiceAddComponent, InvoiceAddModule } from './pages/MASTER PAGES/invoice-add/invoice-add.component';
import { DepartmentModule } from './pages/MASTER PAGES/Departments/department/department.component';
import { ItemModule } from './pages/MASTER PAGES/Items/item/item.component';
import { InsuranceComponent, InsuranceModule } from './pages/MASTER PAGES/insurance/insurance.component';
import { SchemaComponent, SchemaModule } from './pages/MASTER PAGES/schema/schema.component';
import { DateWiseSummaryComponent, DateWiseSummaryModule } from './pages/REPORTS/dateWiseSummary/date-wise-summary/date-wise-summary.component';
import { BillWiseSummaryComponent, BillWiseSummaryModule } from './pages/REPORTS/billWiseSummary/bill-wise-summary/bill-wise-summary.component';
import { StaffWiseSummaryComponent, StaffWiseSummaryModule } from './pages/REPORTS/staffWiseSummary/staff-wise-summary/staff-wise-summary.component';
import { SchemeWiseSummaryComponent, SchemeWiseSummaryModule } from './pages/REPORTS/schemeWiseSummary/scheme-wise-summary/scheme-wise-summary.component';
import { SchemeWiseBillSummaryComponent, SchemeWiseBillSummaryModule } from './pages/REPORTS/schemeWiseBillSummary/scheme-wise-bill-summary/scheme-wise-bill-summary.component';
import { PatientWiseSummaryComponent, PatientWiseSummaryModule } from './pages/REPORTS/patientWiseSummary/patient-wise-summary/patient-wise-summary.component';
import { TestItemWiseSummaryComponent, TestItemWiseSummaryModule } from './pages/REPORTS/testItemWiseSummary/test-item-wise-summary/test-item-wise-summary.component';




@NgModule({
  declarations: [AppComponent],
  imports: [
    TaskListModule,
    BrowserModule,
    SideNavOuterToolbarModule,
    AppFooterModule,
    DxSelectBoxModule,
    DxFormModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule,
    LoginFormModule,
    UserListModule,
    HospitalListModule,
    InvoiceListModule,
    InvoiceAddModule,
    DepartmentModule,
    ItemModule,
    InsuranceModule,
    SchemaModule,
    DateWiseSummaryModule,
    BillWiseSummaryModule,
    StaffWiseSummaryModule,
    SchemeWiseSummaryModule,
    SchemeWiseBillSummaryModule,
    PatientWiseSummaryModule,
    TestItemWiseSummaryModule

  ],
  providers: [
    AuthService,
    ScreenService,
    AppInfoService,
    ThemeService,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
