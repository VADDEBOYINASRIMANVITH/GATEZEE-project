import { environment } from "../src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: "root" })
export class EmployeeService {
  private apiBaseUrl: string = environment.apiBaseUrl + "employee/";

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  createNewEmployee(employeeObj) {
    let api = this.apiBaseUrl;
    return this.http.post<{ message: string }>(api, employeeObj);
  }

  getSingleEmployee(employeeId) {
    let api = this.apiBaseUrl + `${employeeId}`;
    return this.http.get<{ message: string; employeeObj: any }>(api);
  }

  getAllEmployees() {
    let api = this.apiBaseUrl;
    return this.http.get<{ message: string; allEmployeesObj: any }>(api);
  }

  updateSingleEmployee(employeeId, body) {
    /*by employee
    employee : change his details like {email,phone,parentEmail,imageFile}
    */
    let api = this.apiBaseUrl + `${employeeId}`;
    return this.http.patch<{ message: string }>(api, body);
  }

  deleteSingleEmployee(employeeId, body) {
    /*only by admin
      {status:resigned,active,intern}
    */
    let api = this.apiBaseUrl + `${employeeId}`;
    return this.http.delete<{ message: string }>(api, body);
  }
}
