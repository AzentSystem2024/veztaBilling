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



@NgModule({
  declarations: [AppComponent,],
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
    DepartmentModule

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
