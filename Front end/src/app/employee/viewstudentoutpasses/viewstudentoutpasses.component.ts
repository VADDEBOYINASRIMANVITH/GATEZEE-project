import { StudentService } from "./../../../../shared-services/student.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { GlobalService } from "shared-services/global.service";
import { StudentOutpassService } from "shared-services/studentoutpass.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { StudentprofiledialogComponent } from "../studentprofiledialog/studentprofiledialog.component";
import { StudentoutpassdialogboxComponent } from "../studentoutpassdialogbox/studentoutpassdialogbox.component";

export interface data {
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
}

@Component({
  selector: "app-viewstudentoutpasses",
  templateUrl: "./viewstudentoutpasses.component.html",
  styleUrls: ["./viewstudentoutpasses.component.scss"],
  providers: [MessageService],
})
export class ViewstudentoutpassesComponent implements OnInit {
  constructor(
    private globalservice: GlobalService,
    private studentoutpassservice: StudentOutpassService,
    private router: Router,
    private route: ActivatedRoute,
    private studentservice: StudentService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    "createdDate",
    "outgoingDate",
    "reason",
    "status",
  ];
  REQUEST_DATA: data[] = [];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  presentEmployee: any;
  presentStudent: any;
  presentStudentOutpasses: any;

  async viewParticularOutPass(outpass_id) {
    console.log("outpass_id :", outpass_id);

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

  async ngOnInit() {
    this.route.paramMap.subscribe(async (parammap) => {
      let studentId = parammap.get("studentId");
      try {
        this.presentEmployee = await this.globalservice.getUserBasedOnToken();
        this.presentStudent = (
          await this.studentservice.getSingleStudent(studentId).toPromise()
        ).studentObj;
        this.presentStudentOutpasses = (
          await this.studentoutpassservice
            .getStudentAllOutPasses(studentId)
            .toPromise()
        ).allStudentOutPasses;

        this.REQUEST_DATA = this.presentStudentOutpasses;
        this.dataSource = new MatTableDataSource(this.REQUEST_DATA);

        setTimeout(() => (this.dataSource.sort = this.sort));
        setTimeout(() => (this.dataSource.paginator = this.paginator));

        console.log("outpassess :", this.presentStudentOutpasses);
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
    });
  }

  onBackButtonToMyStudents() {
    this.router.navigateByUrl("v1/employee/dashboard/mystudents");
  }

  openStudentProfile() {
    this.dialog.open(StudentprofiledialogComponent, {
      data: this.presentStudent._id,
    });
  }

  refreshTable() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
