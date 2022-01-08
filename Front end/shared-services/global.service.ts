import { NotificationService } from "./notification.service";
import { environment } from "./../src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class GlobalService {
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  // variables
  private isLoggedIn = false;
  private token: string;
  private apiBaseUrl: string = environment.apiBaseUrl;

  // subjects
  private loggedInSubject = new Subject<boolean>();
  private loggedInSubjectListener = new Subject<boolean>().asObservable();

  getToken() {
    return this.token;
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  async userLogin(loginObject) {
    let api = this.apiBaseUrl + `auth/login`;
    let login = {
      Id: loginObject.Id,
      password: loginObject.password,
    };
    //  try {
    let result = await this.http
      .post<{ message: string; designation: string; signedToken: string }>(
        api,
        login
      )
      .toPromise();
    console.log(result);
    this.token = result.signedToken;

    // 1. save the token in local storage
    this.saveToken(this.token);

    // 2. Notify our App
    this.loggedInSubject.next(true);

    // 3. Appropriate routing
    if (result.designation == "student") {
      this.router.navigateByUrl("v1/student/dashboard");
    } else if (result.designation == "employee") {
      this.router.navigateByUrl("v1/employee/dashboard");
    } else if (result.designation == "security") {
      this.router.navigateByUrl("v1/security/dashboard");
    } else if (result.designation == "hod") {
      this.router.navigateByUrl("v1/hod/dashboard");
    } else if (result.designation == "admin") {
      this.router.navigateByUrl("v1/admin/dashboard");
    }
  }

  saveToken(token: string) {
    localStorage.setItem("GPMSTOKEN", token);
  }

  forgotPassword(idObject) {
    let api = this.apiBaseUrl + `auth/forgotpassword`;
    return this.http.post<{ message: string }>(api, idObject);
  }

  resetPassword(resetPasswordObject, token) {
    let api = this.apiBaseUrl + `auth/resetpassword/${token}`;

    return this.http.patch<{ message: string }>(api, resetPasswordObject);
  }

  changePassword(idObject) {
    let api = this.apiBaseUrl + `auth/changepassword`;
    return this.http.post<{ message: string }>(api, idObject);
  }

  getUserFile(filename: string) {
    let api = this.apiBaseUrl + `file/userfile`;
    return this.http.post(
      api,
      { filename: filename },
      { responseType: "blob" }
    );
  }
  getUserImage(filename: string) {
    let api = this.apiBaseUrl + `file/userimage`;
    return this.http.post(
      api,
      { filename: filename },
      { responseType: "blob" }
    );
  }

  async getUserBasedOnToken() {
    try {
      // 1. Check if token is there , if not there do log out process and redirect
      let token = localStorage.getItem("GPMSTOKEN");
      if (!token) {
        this.logout();
      } else {
        // else make http call
        let api = this.apiBaseUrl + `auth/getuserbasedontoken/${token}`;
        let result = await this.http
          .get<{ message: string; userObj: any }>(api)
          .toPromise();
        return result.userObj;
      }
    } catch (err) {
      this.removeToken();
      this.notifyLogout();
      //send error messae via notification
      this.notificationService.danger(err.error.message);
      //  Redirect to the Login Page
      this.router.navigateByUrl("v1/login");
    }
  }

  logout() {
    this.removeToken();

    this.notifyLogout();

    //send some small messae via notification
    this.notificationService.success("Logout Successful!");

    //  Redirect to the Login Page
    this.router.navigateByUrl("v1/login");
  }

  removeToken() {
    //  Remove the token from Local storage.
    localStorage.removeItem("GPMSTOKEN");
  }

  notifyLogout() {
    //  Inform the APP that user has logged Out.
    this.isLoggedIn = false;
    this.loggedInSubject.next(false);
  }
}
