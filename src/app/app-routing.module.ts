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
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardService],
      },
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
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
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
