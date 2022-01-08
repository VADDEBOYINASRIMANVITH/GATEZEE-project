import { environment } from "../src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: "root" })
export class StudentOutpassService {
  private apiBaseUrl: string =
    environment.apiBaseUrl + "outpass/studentoutpass/";

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  createNewStudentOutPass(outpassObject) {
    let api = this.apiBaseUrl;
    return this.http.post<{ message: string }>(api, outpassObject);
  }

  getSingleStudentOutPass(reqId) {
    let api = this.apiBaseUrl + `${reqId}`;
    return this.http.get<{ message: string; studentOutPass: any }>(api);
  }

  getStudentAllOutPasses(studentId) {
    let api = this.apiBaseUrl + "getall/" + `${studentId}`;
    return this.http.get<{ message: string; allStudentOutPasses: any }>(api);
  }

  getAllStudentsAllOutPasses() {
    let api = this.apiBaseUrl + "getall/";
    return this.http.get<{ message: string; allStudentsAllOutPasses: any }>(
      api
    );
  }

  updateStudentOutPass(reqId, body) {
    /*
    this is by student,hod,employee

    student - update outpass Details - body contains new details to be updated
    hod/employee - accept/reject the outpass - body contains {status : accepted/rejected}

    */
    let api =
      environment.apiBaseUrl + "outpass/updatestudentoutpass/" + `${reqId}`;
    return this.http.patch<{ message: string }>(api, body);
  }

  cancelSingleStudentOutPass(reqId: string) {
    let api =
      environment.apiBaseUrl + "outpass/cancelstudentoutpass/" + `${reqId}`;
    return this.http.patch<{ message: string }>(api, {});
  }

  deleteSingleStudentOutPass(reqId) {
    let api = this.apiBaseUrl + `${reqId}`;
    return this.http.delete<{ message: string }>(api);
  }

  authenticateStudentOutpassBySecurity(reqId) {
    console.log("in authenticat service");
    console.log(reqId);
    return this.http.patch<{ message: string; studentObj: any }>(
      environment.apiBaseUrl + "outpass/updatestudentoutpass/" + `${reqId}`,
      {}
    );
  }
}
