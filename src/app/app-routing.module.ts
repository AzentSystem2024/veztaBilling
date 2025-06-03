import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {
  
  CreateAccountFormComponent,
  
} from './components';
import { AuthGuardService } from './services';
import {
  SideNavOuterToolbarComponent,
  UnauthenticatedContentComponent,
} from './layouts';

import { DashboardComponent } from './pages/HOME/dashboard/dashboard.component';
import { LoginFormComponent } from './components/Login/login-form/login-form.component';
import { UserListComponent } from './pages/MASTER PAGES/userFiles/user-list/user-list.component';
import { InvoiceListComponent } from './pages/MASTER PAGES/invoiceFiles/invoice-list/invoice-list.component';
import { HospitalListComponent } from './pages/MASTER PAGES/hospitalFiles/hospital-list/hospital-list.component';
import { InvoiceAddComponent } from './pages/MASTER PAGES/invoice-add/invoice-add.component';
import { DepartmentComponent } from './pages/MASTER PAGES/Departments/department/department.component';
import { ItemComponent } from './pages/MASTER PAGES/Items/item/item.component';
import { InsuranceComponent } from './pages/MASTER PAGES/insurance/insurance.component';
import { SchemaComponent } from './pages/MASTER PAGES/schema/schema.component';
import { DateWiseSummaryComponent } from './pages/REPORTS/dateWiseSummary/date-wise-summary/date-wise-summary.component';
import { BillWiseSummaryComponent } from './pages/REPORTS/billWiseSummary/bill-wise-summary/bill-wise-summary.component';
import { StaffWiseSummaryComponent } from './pages/REPORTS/staffWiseSummary/staff-wise-summary/staff-wise-summary.component';
import { SchemeWiseSummaryComponent } from './pages/REPORTS/schemeWiseSummary/scheme-wise-summary/scheme-wise-summary.component';
import { SchemeWiseBillSummaryComponent } from './pages/REPORTS/schemeWiseBillSummary/scheme-wise-bill-summary/scheme-wise-bill-summary.component';
import { PatientWiseSummaryComponent } from './pages/REPORTS/patientWiseSummary/patient-wise-summary/patient-wise-summary.component';
import { TestItemWiseSummaryComponent } from './pages/REPORTS/testItemWiseSummary/test-item-wise-summary/test-item-wise-summary.component';
import { HospitalWiseSummaryComponent } from './pages/REPORTS/hospital-wise-summary/hospital-wise-summary.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  


  {
    path: 'auth',
    component: UnauthenticatedContentComponent,
    children: [
      {
        path: 'login',
        component: LoginFormComponent,  // <-- Add this line
      },
       
      {
        path: 'create-account',
        component: CreateAccountFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      
    ],
  },
  {
    path: '',
    component: SideNavOuterToolbarComponent,
    children: [
      // {
      //   path: 'dashboard',
      //   component: DashboardComponent,
      //   canActivate: [AuthGuardService],
      // },
      {
        path: 'user',
        component: UserListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'invoice',
        component: InvoiceListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path : 'hospital',
        component : HospitalListComponent,
        canActivate: [AuthGuardService],
      },

        {
        path: 'department',
        component: DepartmentComponent,
        canActivate: [AuthGuardService],
      },
         {
        path: 'item',
        component: ItemComponent,
    },
       {
        path: 'insurance',
        component:InsuranceComponent,
        canActivate:[AuthGuardService]
      },
      {
        path: 'schema',
        component : SchemaComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'invoice-entry',
        component: InvoiceAddComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'datewise-summary',
        component: DateWiseSummaryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'billwise-summary',
        component: BillWiseSummaryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'staffwise-summary',
        component: StaffWiseSummaryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'schemewise-summary',
        component: SchemeWiseSummaryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'schemewise-bill-summary',
        component: SchemeWiseBillSummaryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'patientwise-summary',
        component: PatientWiseSummaryComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'testitemwise-summary',
        component: TestItemWiseSummaryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'hospitalwise-summary',
        component: HospitalWiseSummaryComponent,
        canActivate: [AuthGuardService],
      },
      //   {
      //   path: 'testitemwise-summary',
      //   component: HospitalWiseSummaryComponent,
      //   canActivate: [AuthGuardService],
      // },
     
      // {
      //   path: '**',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full',
      // },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), BrowserModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
