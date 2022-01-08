import { OutpassdialogboxComponent } from "./../outpassdialogbox/outpassdialogbox.component";
import { RequestoutpassComponent } from "./../requestoutpass/requestoutpass.component";
import { Component, ViewChild, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { StudentOutpassService } from "shared-services/studentoutpass.service";
import { GlobalService } from "shared-services/global.service";
import { Router } from "@angular/router";
import { MatDialogService } from "shared-services/mat-dialog.service";
import { MessageService } from "primeng/api";

interface data {
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
  selector: "app-viewoutpasses",
  templateUrl: "./viewoutpasses.component.html",
  styleUrls: ["./viewoutpasses.component.scss"],
  providers: [MessageService],
})
export class ViewoutpassesComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private studentoutpassservice: StudentOutpassService,
    private globalservice: GlobalService,
    private router: Router,
    private matdialogservice: MatDialogService,
    private messageService: MessageService
  ) {}

  displayedColumns: string[] = [
    "createdDate",
    "outgoingDate",
    "reason",
    "status",
    "qrbutton",
  ];
  REQUEST_DATA: data[] = [];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  requestOutPass() {
    this.router.navigateByUrl("v1/student/dashboard/requestoutpass");
  }

  async viewParticularOutPass(outpass_id) {
    console.log("outpass_id :", outpass_id);

    let studentOutPass = (
      await this.studentoutpassservice
        .getSingleStudentOutPass(outpass_id)
        .toPromise()
    ).studentOutPass;
    console.log("student_outpass :", studentOutPass);
    this.dialog.open(OutpassdialogboxComponent, { data: studentOutPass });
  }

  async ngOnInit() {
    //avaneesh
    try {
      let studentObj = await this.globalservice.getUserBasedOnToken();
      let studentOutPasses = (
        await this.studentoutpassservice
          .getStudentAllOutPasses(studentObj._id)
          .toPromise()
      ).allStudentOutPasses;

      this.REQUEST_DATA = studentOutPasses;
      this.dataSource = new MatTableDataSource(this.REQUEST_DATA);

      setTimeout(() => (this.dataSource.sort = this.sort));
      setTimeout(() => (this.dataSource.paginator = this.paginator));

      console.log("outpassess :", studentOutPasses);
    } catch (error) {
      console.log(error);
      this.messageService.add({
        key: "toastElement",
        severity: "error",
        summary: "ERROR",
        detail: error.error.message,
        sticky: true,
      });
    }
  }

  openQRCode(outpass_id) {
    console.log("QR code");

    let msg = outpass_id + ":student";

    this.matdialogservice.openQRCodeDialog(msg);
  }

  refreshTable() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
