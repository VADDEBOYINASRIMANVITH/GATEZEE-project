import { Component, ViewChild, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { GlobalService } from "shared-services/global.service";
import { Router } from "@angular/router";
import { MatDialogService } from "shared-services/mat-dialog.service";
import { MessageService } from "primeng/api";
import { EmployeeOutpassService } from "shared-services/employeeoutpass.service";
import { OutpassdialogboxComponent } from "../outpassdialogbox/outpassdialogbox.component";

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
  belongsToEmployee: string;
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
    private employeeoutpassservice: EmployeeOutpassService,
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
    this.router.navigateByUrl("v1/employee/dashboard/requestoutpass");
  }

  async viewParticularOutPass(outpass_id) {
    console.log("outpass_id :", outpass_id);

    let employeeOutPass = (
      await this.employeeoutpassservice
        .getSingleEmployeeOutPass(outpass_id)
        .toPromise()
    ).employeeOutPass;
    console.log("employee_outpass :", employeeOutPass);
    this.dialog.open(OutpassdialogboxComponent, { data: employeeOutPass });
  }

  async ngOnInit() {
    //avaneesh
    try {
      let employeeObj = await this.globalservice.getUserBasedOnToken();
      let employeeOutPasses = (
        await this.employeeoutpassservice
          .getEmployeeAllOutPasses(employeeObj._id)
          .toPromise()
      ).allEmployeeOutPasses;

      this.REQUEST_DATA = employeeOutPasses;
      this.dataSource = new MatTableDataSource(this.REQUEST_DATA);

      setTimeout(() => (this.dataSource.sort = this.sort));
      setTimeout(() => (this.dataSource.paginator = this.paginator));

      console.log("outpassess :", employeeOutPasses);
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

    let msg = outpass_id + ":employee";

    this.matdialogservice.openQRCodeDialog(msg);
  }

  refreshTable() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
