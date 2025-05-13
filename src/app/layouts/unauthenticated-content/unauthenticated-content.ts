import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthenticated-content',
  template: `
   
      <router-outlet></router-outlet>
  
  `,
  styles: [`
    :host {
      width: 100%;
      height: 100%;
    }
  `],
})
export class UnauthenticatedContentComponent {
  constructor(private router: Router) { }

  // get description() {
  //   const path = this.router.url.split('/').at(-1);
  //   switch (path) {
  //     case 'reset-password': return 'Please enter you email or mobile ';
  //     default: return '';
  //   }
  // }

  get title() {
    const path = this.router.url.split('/').at(-1);
    switch (path) {
      case 'login': return 'Project X';
      case 'create-account': return 'Sign Up';
      case 'change-password': return 'Change Password';
      default: return '';
    }
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [UnauthenticatedContentComponent],
  exports: [UnauthenticatedContentComponent],
})
export class UnauthenticatedContentModule { }
