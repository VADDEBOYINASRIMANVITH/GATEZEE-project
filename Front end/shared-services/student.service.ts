import { environment } from "../src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: "root" })
export class StudentService {
  private apiBaseUrl: string = environment.apiBaseUrl + "student/";

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  createNewStudent(studentObj) {
    let api = this.apiBaseUrl;
    return this.http.post<{ message: string }>(api, studentObj);
  }

  getSingleStudent(studentId) {
    let api = this.apiBaseUrl + `${studentId}`;
    return this.http.get<{ message: string; studentObj: any }>(api);
  }
  getAllStudents() {
    let api = this.apiBaseUrl;
    return this.http.get<{ message: string; allStudentsObj: any }>(api);
  }

  updateSingleStudent(studentId, body) {
    /*by both employee and student
    employee : change parents mobile number because student does not have right {parentPhone : 9876452222}

    student : change his details like {email,phone,parentEmail,imageFile}
    */
    let api = this.apiBaseUrl + `${studentId}`;
    return this.http.patch<{ message: string }>(api, body);
  }

  deleteSingleStudent(studentId, body) {
    /*only by admin
      {status:passout,dropout,detained}
    */
    let api = this.apiBaseUrl + `${studentId}`;
    return this.http.delete<{ message: string }>(api, body);
  }
}
