import { EmployeeprofiledialogComponent } from "./../employeeprofiledialog/employeeprofiledialog.component";
import { EmployeeoutpassdialogboxComponent } from "./../employeeoutpassdialogbox/employeeoutpassdialogbox.component";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { EmployeeService } from "shared-services/employee.service";
import { EmployeeOutpassService } from "shared-services/employeeoutpass.service";
import { GlobalService } from "shared-services/global.service";

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
  selector: "app-viewemployeeoutpasses",
  templateUrl: "./viewemployeeoutpasses.component.html",
  styleUrls: ["./viewemployeeoutpasses.component.scss"],
  providers: [MessageService],
})
export class ViewemployeeoutpassesComponent implements OnInit {
  constructor(
    private globalservice: GlobalService,
    private employeeoutpassservice: EmployeeOutpassService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeservice: EmployeeService,
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

  presentHod: any;
  presentEmployee: any;
  presentEmployeeOutPasses: any;

  async ngOnInit() {
    this.route.paramMap.subscribe(async (parammap) => {
      let employeeId = parammap.get("employeeId");
      try {
        this.presentHod = await this.globalservice.getUserBasedOnToken();
        this.presentEmployee = (
          await this.employeeservice.getSingleEmployee(employeeId).toPromise()
        ).employeeObj;
        this.presentEmployeeOutPasses = (
          await this.employeeoutpassservice
            .getEmployeeAllOutPasses(employeeId)
            .toPromise()
        ).allEmployeeOutPasses;

        this.REQUEST_DATA = this.presentEmployeeOutPasses;
        this.dataSource = new MatTableDataSource(this.REQUEST_DATA);

        setTimeout(() => (this.dataSource.sort = this.sort));
        setTimeout(() => (this.dataSource.paginator = this.paginator));
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

  async viewParticularOutPass(outpass_id) {
    console.log("outpass_id :", outpass_id);

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

  onBackButtonToMyEmployees() {
    this.router.navigateByUrl("v1/hod/dashboard/myemployees");
  }

  refreshTable() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  openEmployeeProfile() {
    this.dialog.open(EmployeeprofiledialogComponent, {
      data: this.presentEmployee._id,
    });
  }
}
