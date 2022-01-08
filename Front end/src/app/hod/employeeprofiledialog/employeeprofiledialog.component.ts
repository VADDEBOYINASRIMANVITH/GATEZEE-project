import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "primeng/api";
import { EmployeeService } from "shared-services/employee.service";
import { EmployeeOutpassService } from "shared-services/employeeoutpass.service";
import { GlobalService } from "shared-services/global.service";
import { HodService } from "shared-services/hod.service";
import { StudentService } from "shared-services/student.service";
import { StudentOutpassService } from "shared-services/studentoutpass.service";

@Component({
  selector: "app-employeeprofiledialog",
  templateUrl: "./employeeprofiledialog.component.html",
  styleUrls: ["./employeeprofiledialog.component.scss"],
  providers: [MessageService],
})
export class EmployeeprofiledialogComponent implements OnInit {
  presentMentorImageUrl: any;
  presentHod: any;
  presentMentor: any;
  employeeOutPassPiedata: any;
  employeePerformancePiedata: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private globalservice: GlobalService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private studentservice: StudentService,
    private studentoutpassservice: StudentOutpassService,
    private employeeoutpassservice: EmployeeOutpassService,
    private employeeservice: EmployeeService
  ) {}

  async ngOnInit() {
    try {
      this.presentHod = await this.globalservice.getUserBasedOnToken();
      this.presentMentor = (
        await this.employeeservice.getSingleEmployee(this.data).toPromise()
      ).employeeObj;

      this.globalservice
        .getUserImage(this.presentMentor.imageFileName)
        .subscribe((file) => {
          let unsafeImageUrl = URL.createObjectURL(file);
          this.presentMentorImageUrl =
            this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        });

      let presentMentorOutpasses = (
        await this.employeeoutpassservice
          .getEmployeeAllOutPasses(this.presentMentor._id)
          .toPromise()
      ).allEmployeeOutPasses;

      this.updateEmployeeOutPassPieChartData(presentMentorOutpasses);

      let allStudentsAllOutpasses = (
        await this.studentoutpassservice
          .getAllStudentsAllOutPasses()
          .toPromise()
      ).allStudentsAllOutPasses;

      this.updateEmployeePerformancePieChartData(
        allStudentsAllOutpasses.filter(
          (el) => el.statusUpdatedBy == this.presentMentor.Id
        )
      );
    } catch (error) {
      console.log(error);
      this.messageService.add({
        key: "toastElement",
        severity: "error",
        summary: "ERROR",
        detail: error.error.message,
        sticky: false,
      });
    }
  }

  updateEmployeeOutPassPieChartData(presentStudentOutpasses) {
    let accepted = presentStudentOutpasses.filter(
      (el) => el.status == "accepted"
    ).length;
    let pending = presentStudentOutpasses.filter(
      (el) => el.status == "pending"
    ).length;
    let cancelled = presentStudentOutpasses.filter(
      (el) => el.status == "cancelled"
    ).length;
    let unread = presentStudentOutpasses.filter(
      (el) => el.status == "unread"
    ).length;
    let rejected = presentStudentOutpasses.filter(
      (el) => el.status == "rejected"
    ).length;
    let deleted = presentStudentOutpasses.filter(
      (el) => el.status == "deleted"
    ).length;

    // console.log("ac", accepted);
    // console.log("pn", pending);
    // console.log("ur", unread);
    // console.log("canc", cancelled);
    // console.log("rej", rejected);
    // console.log("del", deleted);

    this.employeeOutPassPiedata = {
      labels: [
        "Pending",
        "Accepted",
        "Cancelled",
        "Unread",
        "Rejected",
        "Deleted",
      ],
      datasets: [
        {
          data: [pending, accepted, cancelled, unread, rejected, deleted],
          backgroundColor: [
            "#FF6384",
            "#32CD32",
            "#FFCE56",
            "#36A2EB",
            "#FFA500",
            "#000000",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#32CD32",
            "#FFCE56",
            "#36A2EB",
            "#FFA500",
            "#000000",
          ],
        },
      ],
    };
  }

  updateEmployeePerformancePieChartData(allStudentsAllOutpasses) {
    let accepted = allStudentsAllOutpasses.filter(
      (el) => el.status == "accepted"
    ).length;
    let rejected = allStudentsAllOutpasses.filter(
      (el) => el.status == "rejected"
    ).length;

    this.employeePerformancePiedata = {
      labels: ["Accepted", "Rejected"],
      datasets: [
        {
          data: [accepted, rejected],
          backgroundColor: ["#32CD32", "#FFA500"],
          hoverBackgroundColor: ["#32CD32", "#FFA500"],
        },
      ],
    };
  }
}
