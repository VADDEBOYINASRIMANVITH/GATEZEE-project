import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { EmployeeOutpassService } from "shared-services/employeeoutpass.service";
import { GlobalService } from "shared-services/global.service";
import { StudentOutpassService } from "shared-services/studentoutpass.service";
import { StudentoutpassdialogboxComponent } from "../studentoutpassdialogbox/studentoutpassdialogbox.component";

export interface studentOutPass {
  outgoingDate: Date;
  outgoingTime: string;
  incomingTime: string;
  reason: string;
  description: string;
  createdDate: Date;
  incomingDate: Date;
  status: string;
  percentageOfEmergency: number;
  statusUpdatedBy: string;
  belongsToStudent: string;
  statusUpdatedAt: Date;
  detailsUpdatedAt: Date;
  isAuthenticated: boolean;
  authenticatedBy: string;
  isAuthenticatedAt: Date;
  otp: number;
  fileName: string;
  studentObj: any;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  studentAcceptancePieData;
  presentEmployee: any;
  allStudentsAllOutpasses;
  employeeOutPassPieData;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private globalservice: GlobalService,
    private studentoutpassservice: StudentOutpassService,
    private employeeoutpassservice: EmployeeOutpassService,
    private messageservice: MessageService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns2: string[] = [
    "studentObj.Id",
    "studentObj.name",
    "createdDate",
    "outgoingDate",
    "reason",
    "status",
  ];
  REQUEST_DATA2: studentOutPass[] = [];
  dataSource2;
  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  async ngOnInit() {
    try {
      this.presentEmployee = await this.globalservice.getUserBasedOnToken();
      //employee outpass pie data related
      let allEmployeeOutPasses = (
        await this.employeeoutpassservice
          .getEmployeeAllOutPasses(this.presentEmployee._id)
          .toPromise()
      ).allEmployeeOutPasses;

      this.updateEmployeeOutpassData(allEmployeeOutPasses);

      //all student all outpass table related
      this.allStudentsAllOutpasses = (
        await this.studentoutpassservice
          .getAllStudentsAllOutPasses()
          .toPromise()
      ).allStudentsAllOutPasses;
      //studentoutpass table - 2
      this.REQUEST_DATA2 = this.allStudentsAllOutpasses;
      this.dataSource2 = new MatTableDataSource(this.REQUEST_DATA2);

      setTimeout(() => (this.dataSource2.sort = this.sort));
      setTimeout(() => (this.dataSource2.paginator = this.paginator));
      //pie - student acceptance
      this.updateStudentAcceptancePieChartData(
        this.allStudentsAllOutpasses.filter(
          (el) => el.statusUpdatedBy == this.presentEmployee.Id
        )
      );
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

  async viewParticularStudentOutPass(outpass_id) {
    console.log("student outpass_id :", outpass_id);

    let studentOutPass = (
      await this.studentoutpassservice
        .getSingleStudentOutPass(outpass_id)
        .toPromise()
    ).studentOutPass;
    console.log("student_outpass :", studentOutPass);
    this.dialog.open(StudentoutpassdialogboxComponent, {
      data: studentOutPass,
    });
  }

  updateStudentAcceptancePieChartData(allStudentsAllOutpasses) {
    let accepted = allStudentsAllOutpasses.filter(
      (el) => el.status == "accepted"
    ).length;
    let rejected = allStudentsAllOutpasses.filter(
      (el) => el.status == "rejected"
    ).length;

    this.studentAcceptancePieData = {
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

  updateEmployeeOutpassData(allEmployeeOutPasses) {
    let accepted = allEmployeeOutPasses.filter(
      (el) => el.status == "accepted"
    ).length;
    let pending = allEmployeeOutPasses.filter(
      (el) => el.status == "pending"
    ).length;
    let cancelled = allEmployeeOutPasses.filter(
      (el) => el.status == "cancelled"
    ).length;
    let unread = allEmployeeOutPasses.filter(
      (el) => el.status == "unread"
    ).length;
    let rejected = allEmployeeOutPasses.filter(
      (el) => el.status == "rejected"
    ).length;
    let deleted = allEmployeeOutPasses.filter(
      (el) => el.status == "deleted"
    ).length;

    // console.log("ac", accepted);
    // console.log("pn", pending);
    // console.log("ur", unread);
    // console.log("canc", cancelled);
    // console.log("rej", rejected);
    // console.log("del", deleted);

    this.employeeOutPassPieData = {
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
  refreshTable() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
