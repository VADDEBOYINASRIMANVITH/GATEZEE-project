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
import { EmployeeoutpassdialogboxComponent } from "../employeeoutpassdialogbox/employeeoutpassdialogbox.component";
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

export interface employeeOutpass {
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
  employeeObj: any;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
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

  displayedColumns1: string[] = [
    "Id",
    "name",
    "createdDate",
    "outgoingDate",
    "reason",
    "status",
  ];
  REQUEST_DATA1: employeeOutpass[] = [];
  dataSource1;
  applyFilter1(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  displayedColumns2: string[] = [
    "Id",
    "name",
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

  presentHod: any;
  studentAcceptancePieData: any;
  employeeAcceptancePieData: any;
  allStudentsAllOutpasses: any;
  allEmployeesAllOutPasses: any;

  async ngOnInit() {
    try {
      this.presentHod = await this.globalservice.getUserBasedOnToken();

      //student related
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
          (el) => el.statusUpdatedBy == this.presentHod.Id
        )
      );

      //employee related
      this.allEmployeesAllOutPasses = (
        await this.employeeoutpassservice
          .getAllEmployeesAllOutPasses()
          .toPromise()
      ).allEmployeesAllOutPasses;
      //employee outpass table 1
      this.REQUEST_DATA1 = this.allEmployeesAllOutPasses;
      this.dataSource1 = new MatTableDataSource(this.REQUEST_DATA1);

      setTimeout(() => (this.dataSource1.sort = this.sort));
      setTimeout(() => (this.dataSource1.paginator = this.paginator));
      //pie - employee acceptance
      this.updateEmployeeAcceptancePieChartData(
        this.allEmployeesAllOutPasses.filter(
          (el) => el.statusUpdatedBy == this.presentHod.Id
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

  async viewParticularEmployeeOutPass(outpass_id) {
    console.log("employee outpass_id :", outpass_id);

    let employeeOutPass = (
      await this.employeeoutpassservice
        .getSingleEmployeeOutPass(outpass_id)
        .toPromise()
    ).employeeOutPass;
    console.log("employee_outpass :", employeeOutPass);
    this.dialog.open(EmployeeoutpassdialogboxComponent, {
      data: employeeOutPass,
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

  updateEmployeeAcceptancePieChartData(allEmployeesAllOutPasses) {
    let accepted = allEmployeesAllOutPasses.filter(
      (el) => el.status == "accepted"
    ).length;
    let rejected = allEmployeesAllOutPasses.filter(
      (el) => el.status == "rejected"
    ).length;

    this.employeeAcceptancePieData = {
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
  refreshTable() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
