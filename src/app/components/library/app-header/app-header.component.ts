import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { UserPanelModule } from '../user-panel/user-panel.component';
import { AuthService, IUser } from 'src/app/services';
import { ThemeSwitcherModule } from 'src/app/components/library/theme-switcher/theme-switcher.component';
import { DevExtremeModule, DxDropDownBoxComponent, DxDropDownBoxModule, DxDropDownButtonModule, DxTooltipModule } from 'devextreme-angular';
import { Route, Router } from '@angular/router';
import { CustomReuseStrategy } from 'src/app/custom-reuse-strategy';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  providers: [CustomReuseStrategy],
})
export class AppHeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  user: IUser | null = { email: '' };

  userMenuItems = [
    // {
    //   text: 'Change Password',
    //   icon: 'key',
    //   onClick: () => {
    //     this.changePassword();
    //   },
    // },
    {
      id: 'logout',
      text: 'Logout',
      icon: 'runner',
      // onClick: () => {
      //   this.reuseStrategy.clearStoredData();
      //   // Call the logout service
      //   this.authService.logOut().subscribe((response: any) => {
      //     if (response) {
      //       // Clear storage
      //       localStorage.removeItem('sidemenuItems');
      //       sessionStorage.clear();
      //       // Clear stored routes again to ensure no leftovers
      //       this.reuseStrategy.clearStoredData();
      //       // Navigate to the login page
      //       this.router.navigate(['/auth/login']).then(() => {
      //         // window.location.reload();
      //         // this.router.navigate(['/auth/login']);
      //         setTimeout(() => {
      //           window.location.reload();
      //         }, 250);
      //       });
      //     }
      //   });
      // },
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private reuseStrategy: CustomReuseStrategy
  ) {}

  ngOnInit() {
    // Fetch the user and set the loginName
    // this.authService.getUser().then((response) => {
    //   if (response.isOk && response.data) {
    //     this.user = response.data;
    //     this.user.name = this.authService.loginName; // Bind loginName
    //     // Get UserPhoto from sessionStorage
    //     const storedUserPhoto = sessionStorage.getItem('UserPhoto');

    //     // Set avatarUrl: use storedUserPhoto if available, otherwise default to the fallback image
    //     this.user.avatarUrl = storedUserPhoto
    //       ? storedUserPhoto
    //       : 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png';
    //   }
    // });
  }
  changePassword() {
    this.router.navigateByUrl('/change-password');
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  };

  logout() {
    // Remove only user-specific data
    localStorage.removeItem('userData');
    localStorage.removeItem('LOGIN_NAME');
    // Remove any other user-related keys if needed
  
    this.router.navigate(['/auth/login']).then(() => {
      // window.location.reload(); // Reload to reflect the changes
    });
  }
  
  

  handleUserMenuClick(event: any) {
    setTimeout(() => {
      console.log('Dropdown item clicked:', event);
    }, 100);
  }
  
  

  // handleUserMenuClick(event: any) {
  //   console.log('User menu clicked:', event);
  //   const selectedItem = event.itemData?.id;
  //   console.log('Selected item ID:', selectedItem);
  
  //   if (selectedItem === 'logout') {
  //     console.log('Navigating to login page...');
  //     this.router.navigateByUrl('/auth/login');
  //   }
    
  // }
  
  
}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    DxToolbarModule,
    ThemeSwitcherModule,
    UserPanelModule,
    DxTooltipModule,
    DxDropDownButtonModule,
    DevExtremeModule
  ],
  declarations: [AppHeaderComponent],
  exports: [AppHeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppHeaderModule {}
