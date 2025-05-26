import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  DxFormModule,
  DxLoadIndicatorModule,
  DxButtonModule,
} from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import notify from 'devextreme/ui/notify';
import { AuthService, IResponse, ThemeService } from 'src/app/services';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Input() resetLink = '/auth/reset-password';
  defaultAuthData: IResponse;

  btnStylingMode: DxButtonTypes.ButtonStyle;

  loading = false;
  formData: any = {};
  isPasswordVisible = false;
  passwordMode = 'password';

  constructor(
    private renderer: Renderer2,
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private menuService: MenuService
  ) {
    this.formData = {};
    this.themeService.isDark.subscribe((value: boolean) => {
      this.btnStylingMode = value ? 'outlined' : 'contained';
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    const isDarkTheme = document.body.classList.contains('dx-theme-dark');

    // Apply dark theme class if dark mode is active
    const loginBox = document.querySelector('.login-box');
    if (isDarkTheme && loginBox) {
      this.renderer.addClass(loginBox, 'dark-theme');
    }
  }

  togglePasswordVisibility = () => {
    this.isPasswordVisible = !this.isPasswordVisible;
  };

  changePasswordMode() {
    debugger;
    this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
  }
  // async onSubmit(event: Event) {
  //   event.preventDefault(); // Prevent default form submission

async onSubmit(event: Event) {
  event.preventDefault();

  if (!this.formData.LOGIN_NAME || !this.formData.PASSWORD) {
    alert('Please enter login name and password');
    return;
  }

  this.loading = true;

  this.authService.logIn(this.formData.LOGIN_NAME, this.formData.PASSWORD).subscribe(
    (response) => {
      this.loading = false;
      console.log('Login response:', response);

      if (response.flag === 1) {
        // Save user data once
        localStorage.setItem('userData', JSON.stringify(response));

        // Navigate to dashboard
        this.router.navigate(['/dashboard']).then(() => {
          console.log('Navigation to dashboard successful');
          window.location.reload();
        }).catch(err => {
          console.error('Navigation failed:', err);
        });
      } else {
        notify({
          message: response.Message || 'Login failed',
          type: 'error',
          position: { my: 'top right', at: 'top right', of: window }
        });
      }
    },
    (error) => {
      this.loading = false;
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  );
}


  // async onSubmit(event: Event) {

  //  async onSubmit(event: Event) {
  //   event.preventDefault(); // Prevent default form submission

  //   if (!this.formData.LOGIN_NAME || !this.formData.PASSWORD) {
  //     alert('Please enter login name and password');
  //     return;
  //   }

  //   this.loading = true;

  //   // Simulate successful login data
  //   const mockUserData = {
  //     USER_TYPE: 3, // or 4 or any type you'd expect
  //     RESELLER_ID: 123, // if USER_TYPE === 3
  //     CUST_ID: 456,     // if USER_TYPE === 4
  //     LOGIN_NAME: this.formData.LOGIN_NAME
  //   };

  //   // Store mock user data
  //   localStorage.setItem('userData', JSON.stringify(mockUserData));
  //   localStorage.setItem('USER_TYPE', mockUserData.USER_TYPE.toString());

  //   if (mockUserData.USER_TYPE === 3) {
  //     localStorage.setItem('RESELLER_ID', mockUserData.RESELLER_ID.toString());
  //   } else if (mockUserData.USER_TYPE === 4) {
  //     localStorage.setItem('CUST_ID', mockUserData.CUST_ID.toString());
  //   }

  //   // Navigate to dashboard
  //   await this.router.navigate(['/dashboard']);
  //   window.location.reload();
  //   this.loading = false;
  // }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule,
    DxButtonModule,
    FormsModule,
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
})
export class LoginFormModule {}
