import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { EmployeeService } from "shared-services/employee.service";
import { GlobalService } from "shared-services/global.service";

@Component({
  selector: "app-myeemployees",
  templateUrl: "./myeemployees.component.html",
  styleUrls: ["./myeemployees.component.scss"],
  providers: [MessageService],
})
export class MyeemployeesComponent implements OnInit {
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private employeeservice: EmployeeService,
    private messageService: MessageService
  ) {}

  presentHod: any;
  presentHodEmployees: any;

  async ngOnInit() {
    try {
      this.presentHod = await this.globalService.getUserBasedOnToken();
      this.presentHodEmployees = (
        await this.employeeservice.getAllEmployees().toPromise()
      ).allEmployeesObj;
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

  onRowSelect(event) {
    this.router.navigateByUrl(`v1/hod/dashboard/employee/${event.data._id}`);
  }
}
