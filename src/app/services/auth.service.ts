import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
export interface IUser {
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface IResponse {
  isOk: boolean;
  data?: IUser;
  message?: string;
}

const defaultPath = '/';

//=============================Base url==============================
import { environment } from 'src/environments/environment';

const BaseURL = environment.ZATKA_API_BASE_URL;

//==================================Default USer Name and details=======================
export const defaultUser: IUser = {
  email: 'indu@gmail.com',
  name: 'indu',
  avatarUrl:
    'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
};
//============================================================
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedin = new BehaviorSubject<boolean>(false);
  private menuData = new BehaviorSubject<any>(null);

  private _loginName: string;

  SideMenu: any;
  private _user: IUser | null = defaultUser;
  UserData: any;
  // private User:any
  private _lastAuthenticatedPath: string = defaultPath;
  constructor(
    private router: Router,
    private http: HttpClient,


  ) {}

  get loggedIn(): boolean {
    return !!sessionStorage.getItem('LOGIN_NAME') && !!localStorage.getItem('userData');
  }

  isAuthenticated(): boolean {
    const userDataString = localStorage.getItem('userData');
  
    if (!userDataString) {
      return false;
    }
  
    try {
      const userData = JSON.parse(userDataString);
      
      // Ensure LOGIN_NAME exists and USER_TYPE is valid
      return !!(userData.LOGIN_NAME && userData.USER_TYPE);
    } catch (error) {
      this.logout(); // Clear storage if data is corrupted
      return false;
    }
  }
  
  
  
  logout(): void {
    localStorage.removeItem('userData');
    localStorage.clear(); // Ensure everything is cleared
    this.router.navigate(['/auth/login']);
  }
  
  


  // Getter for loginName that retrieves it from session storage
  get loginName(): string {
    return sessionStorage.getItem('LOGIN_NAME') || '';
  }

  // Setter for loginName that sets it to session storage
  set loginName(value: string) {
    sessionStorage.setItem('LOGIN_NAME', value);
  }

  // get loggedIn(): boolean {
  //   return !!this._user;
  // }



  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }



  setUserData(data: any) {
    this.UserData = data;
  }

  getUserData() {
    return this.UserData;
  }
  //=================internet ip of system================================
  // getIPAddress() {
  //   return this.http.get('https://api.ipify.org/?format=json');
  // }

  initializeProject() {
    return this.http.post(`${BaseURL}CustomerInfo/getinfo`, {});
  }
  //================Log In function===============================
  // logIn(username: string, password: string) {
  //   const API_URL = `${BaseURL}user/LOGIN`;
  
  //   const ReqBody = {
  //     LOGIN_NAME: username,  
  //     PASSWORD: password     
  //   };
  
  //   return this.http.post<any>(API_URL, ReqBody);
  // }

  logIn(username: string, password: string) {
    const API_URL = `${BaseURL}user/LOGIN`;
    const ReqBody = {
      LOGIN_NAME: username,
      PASSWORD: password,
    };

    return this.http.post<any>(API_URL, ReqBody).pipe(
      map((response) => {
        if (response) {
          localStorage.setItem('userData', JSON.stringify(response));
          sessionStorage.setItem('LOGIN_NAME', username);
          this.loggedin.next(true);
        }
        return response;
      })
    );
  }

  logOut() {
    const API_URL = `${BaseURL}user/logout`;
    const token = JSON.parse(localStorage.getItem('logData') || '{}').Token;
    const ReqBody = { Token: token };

    return this.http.post(API_URL, ReqBody).pipe(
      map(() => {
        localStorage.removeItem('logData');
        sessionStorage.removeItem('LOGIN_NAME');
        this.loggedin.next(false);
        this.router.navigate(['/auth/login']);
      })
    );
  }
  

  getMenuData() {
    return this.menuData.asObservable();
  }

  isLoggedIn() {
    return this.loggedin.asObservable();
  }

  async getUser() {
    try {
      return {
        isOk: true,
        data: this._user,
      };
    } catch {
      return {
        isOk: false,
        data: null,
      };
    }
  }

  async createAccount(email: string, password: string) {
    try {
      this.router.navigate(['/auth/create-account']);
      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to create account',
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to change password',
      };
    }
  }

  async resetPassword(email: string) {
    try {
      // Send request

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to reset password',
      };
    }
  }

  // logOut() {
  //   const API_URL = ` ${BaseURL}user/logout`;
  //   const token = JSON.parse(localStorage.getItem('logData')).Token;
  //   const ReqBody = { Token: token };
  //   return this.http.post(API_URL, ReqBody);
  // }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isAuthenticated();

    console.log(isLoggedIn, 'AuthGuard Check'); // Debugging Log

    if (!isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return false; // Block navigation
    }

    return true; // Allow navigation if logged in
  }
}
