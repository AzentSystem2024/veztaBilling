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

    this.authService
      .logIn(this.formData.LOGIN_NAME, this.formData.PASSWORD)
      .subscribe(
        (response) => {
          this.loading = false;
          console.log('Login response:', response);

          if (response.flag === 1) {
            // Save user data once
            localStorage.setItem('userData', JSON.stringify(response));
const menus = response.Menus;
// full response from login API
localStorage.setItem('loginResponse', JSON.stringify(response));

// save all menus
localStorage.setItem('allMenus', JSON.stringify(response.Menus));

// filter allowed menus
const allowedMenuNames = [];

if (response.ADD_INVOICE || response.VIEW_INVOICE) {
  allowedMenuNames.push('Invoice List');
}
if (response.ADD_INVOICE) {
  allowedMenuNames.push('New Invoice');
}
// Add more based on logic...

// now filter actual allowed menu objects
const userMenus = response.Menus.filter(menu =>
  allowedMenuNames.includes(menu.MENU_NAME)
);

// store allowed menus
localStorage.setItem('userMenus', JSON.stringify(userMenus));

localStorage.setItem('allMenus', JSON.stringify(menus));
localStorage.setItem('userMenus', JSON.stringify(menus));

            const savedUserData = JSON.parse(
              localStorage.getItem('userData') || '{}'
            );
            console.log('Saved userData:', savedUserData);

            sessionStorage.setItem(
              'savedUserData',
              JSON.stringify(savedUserData)
            );
            // const redirectPath = savedUserData.ADD_INVOICE ? '/invoice-entry' : 'null';
            const redirectPath =
              savedUserData.USER_TYPE_ID === 3 ||
              savedUserData.USER_TYPE_ID === 4
                ? '/invoice-entry'
                : savedUserData.USER_TYPE_ID === 1 ||
                  savedUserData.USER_TYPE_ID === 2
                ? '/invoice'
                : null;

            // Navigate to dashboard
            this.router
              .navigate([redirectPath])
              .then(() => {
                console.log('Navigation to dashboard successful');
                window.location.reload();
              })
              .catch((err) => {
                console.error('Navigation failed:', err);
              });
          } else {
            notify({
              message: response.Message || 'Login failed',
              type: 'error',
              position: { my: 'top right', at: 'top right', of: window },
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
