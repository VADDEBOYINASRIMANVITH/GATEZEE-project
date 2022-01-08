import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { EmployeeService } from "shared-services/employee.service";
import { EmployeeOutpassService } from "shared-services/employeeoutpass.service";
import { GlobalService } from "shared-services/global.service";
import { NotificationService } from "shared-services/notification.service";
import { StudentService } from "shared-services/student.service";

@Component({
  selector: "app-mystudents",
  templateUrl: "./mystudents.component.html",
  styleUrls: ["./mystudents.component.scss"],
  providers: [MessageService],
})
export class MystudentsComponent implements OnInit {
  presentEmployee: any;
  presentEmployeeStudents: any;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private globalservice: GlobalService,
    private notificationService: NotificationService,
    private messageservice: MessageService,
    private employeeservice: EmployeeService, // private hodservice:HodService,
    private employeeoutservice: EmployeeOutpassService,
    private studentservice: StudentService
  ) {}

  onRowSelect(event) {
    console.log(event.data._id);
    this.router.navigateByUrl(`v1/employee/dashboard/student/${event.data._id}`);
  }


  async ngOnInit() {
    try {
      this.presentEmployee = await this.globalservice.getUserBasedOnToken();
      this.presentEmployeeStudents = (
        await this.studentservice.getAllStudents().toPromise()
      ).allStudentsObj;
    } catch (error) {
      console.log(error);
      this.messageservice.add({
        key: "toastElement",
        severity: "error",
        summary: "ERROR",
        detail: error.error.message,
        sticky: false,
      });
    }
  }
}
