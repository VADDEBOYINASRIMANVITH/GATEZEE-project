import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { GlobalService } from "shared-services/global.service";

import { EmployeeService } from "shared-services/employee.service";

@Component({
  selector: "app-editprofile",
  templateUrl: "./editprofile.component.html",
  styleUrls: ["./editprofile.component.scss"],
  providers: [MessageService],
})
export class EditprofileComponent implements OnInit {
  selectedFile;
  presentMentor;
  constructor(
    private globalservice: GlobalService,
    private employeeservice: EmployeeService,
    private messageService: MessageService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.presentMentor = await this.globalservice.getUserBasedOnToken();
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

  async onEdit(value) {
    try {
      console.log(value);
      let formData = new FormData();
      formData.append("phone", value.phone);
      formData.append("email", value.email);
      if (this.selectedFile) formData.append("photo", this.selectedFile);
      this.selectedFile = undefined;

      //http call
      let message = (
        await this.employeeservice
          .updateSingleEmployee(this.presentMentor._id, formData)
          .toPromise()
      ).message;

      this.messageService.add({
        key: "toastElement",
        severity: "success",
        summary: "Success",
        detail: message,
        sticky: false,
      });
      await this.sleep(1500);
      this.router.navigateByUrl("v1/employee/dashboard/profile");
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

  //file upload
  myUploader(obj) {
    this.selectedFile = obj.files[0];
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
