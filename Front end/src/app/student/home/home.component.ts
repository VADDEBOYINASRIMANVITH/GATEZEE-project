import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { GlobalService } from "shared-services/global.service";
import { StudentOutpassService } from "shared-services/studentoutpass.service";
import { NotificationService } from "shared-services/notification.service";
import { MessageService } from "primeng/api";
import { EmployeeService } from "shared-services/employee.service";
import { HodService } from "shared-services/hod.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            title: "My Details",
            cols: 2,
            rows: 1,
            rank: 2,
          },

          { title: "Mentor Details", cols: 2, rows: 1, rank: 3 },
          { title: "HOD Details", cols: 2, rows: 1, rank: 4 },
          { title: "Your Outpasses Status", cols: 2, rows: 1, rank: 5 },
        ];
      }

      return [
        {
          title: "My Details",
          cols: 1,
          rows: 1,
          rank: 2,
        },

        { title: "Mentor Details", cols: 1, rows: 1, rank: 3 },
        { title: "HOD Details", cols: 1, rows: 1, rank: 4 },
        { title: "Your Outpasses Status", cols: 1, rows: 2, rank: 5 },
      ];
    })
  );

  presentStudent: any;
  presentStudentOutpasses: any;
  presentStudentMentorDetails: any;
  presentStudentHodDetails: any;

  piedata;
  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private globalservice: GlobalService,
    private studentoutpassservice: StudentOutpassService,
    private messageservice: MessageService,
    private employeeservice: EmployeeService,
    private hodservice: HodService
  ) {}

  async ngOnInit() {
    try {
      this.presentStudent = await this.globalservice.getUserBasedOnToken();
      this.presentStudentOutpasses = (
        await this.studentoutpassservice
          .getStudentAllOutPasses(this.presentStudent._id)
          .toPromise()
      ).allStudentOutPasses;
      this.updatePieChartData();
      this.presentStudentMentorDetails = (
        await this.employeeservice
          .getSingleEmployee(this.presentStudent.belongsToEmployeeMongo)
          .toPromise()
      ).employeeObj;
      this.presentStudentHodDetails = (
        await this.hodservice
          .getSingleHod(this.presentStudent.belongsToHodMongo)
          .toPromise()
      ).hodObj;

      // console.log("student :", this.presentStudent);
      // console.log("outpassses:", this.presentStudentOutpasses);
      // console.log("mentor :", this.presentStudentMentorDetails);
      // console.log("hod :", this.presentStudentHodDetails);
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

  updatePieChartData() {
    let accepted = this.presentStudentOutpasses.filter(
      (el) => el.status == "accepted"
    ).length;
    let pending = this.presentStudentOutpasses.filter(
      (el) => el.status == "pending"
    ).length;
    let cancelled = this.presentStudentOutpasses.filter(
      (el) => el.status == "cancelled"
    ).length;
    let unread = this.presentStudentOutpasses.filter(
      (el) => el.status == "unread"
    ).length;
    let rejected = this.presentStudentOutpasses.filter(
      (el) => el.status == "rejected"
    ).length;
    let deleted = this.presentStudentOutpasses.filter(
      (el) => el.status == "deleted"
    ).length;

    // console.log("ac", accepted);
    // console.log("pn", pending);
    // console.log("ur", unread);
    // console.log("canc", cancelled);
    // console.log("rej", rejected);
    // console.log("del", deleted);

    this.piedata = {
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
}
