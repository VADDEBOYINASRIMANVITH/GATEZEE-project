import { environment } from "../src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: "root" })
export class EmployeeOutpassService {
  private apiBaseUrl: string =
    environment.apiBaseUrl + "outpass/employeeoutpass/";

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  createNewEmployeeOutPass(outpassObject) {
    let api = this.apiBaseUrl;
    return this.http.post<{ message: string }>(api, outpassObject);
  }

  getSingleEmployeeOutPass(reqId) {
    let api = this.apiBaseUrl + `${reqId}`;
    return this.http.get<{ message: string; employeeOutPass: any }>(api);
  }

  getEmployeeAllOutPasses(EmployeeId) {
    let api = this.apiBaseUrl + "getall/" + `${EmployeeId}`;
    return this.http.get<{ message: string; allEmployeeOutPasses: any }>(api);
  }

  getAllEmployeesAllOutPasses() {
    let api = this.apiBaseUrl + "getall/";
    return this.http.get<{ message: string; allEmployeesAllOutPasses: any }>(
      api
    );
  }

  updateEmployeeOutPass(reqId, body) {
    /*
    this is by Employee,hod

    Employee - update outpass Details - body contains new details to be updated
    hod- accept/reject the outpass - body contains {status : accepted/rejected}

    */
    let api =
      environment.apiBaseUrl + "outpass/updateemployeeoutpass/" + `${reqId}`;
    return this.http.patch<{ message: string }>(api, body);
  }

  cancelSingleEmployeeOutPass(reqId: string) {
    let api =
      environment.apiBaseUrl + "outpass/cancelemployeeoutpass/" + `${reqId}`;
    return this.http.patch<{ message: string }>(api, {});
  }

  deleteSingleEmployeeOutPass(reqId) {
    let api = this.apiBaseUrl + `${reqId}`;
    return this.http.delete<{ message: string }>(api);
  }

  authenticateEmployeeOutpassBySecurity(reqId) {
    return this.http.patch<{ message: string; employeeObj: any }>(
      environment.apiBaseUrl + "outpass/updateemployeeoutpass/" + `${reqId}`,
      {}
    );
  }
}
