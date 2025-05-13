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
import { UserAddComponent, UserAddModule } from './pages/MASTER PAGES/userFiles/user-add/user-add.component';
import { UserEditComponent } from './pages/MASTER PAGES/userFiles/user-edit/user-edit.component';


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
    UserAddModule
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
