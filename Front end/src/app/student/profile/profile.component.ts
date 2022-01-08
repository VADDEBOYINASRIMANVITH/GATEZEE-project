import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { GlobalService } from "shared-services/global.service";
import { EmployeeService } from "shared-services/employee.service";
import { HodService } from "shared-services/hod.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private messageService: MessageService,
    private globalservice: GlobalService,
    private employeeservice: EmployeeService,
    private hodservice: HodService,
    private sanitizer: DomSanitizer
  ) {}
  presentStudent: any;
  presentStudentImageUrl;
  presentStudentMentor: any;
  presentStudentHod: any;

  async ngOnInit() {
    try {
      this.presentStudent = await this.globalservice.getUserBasedOnToken();

      this.globalservice
        .getUserImage(this.presentStudent.imageFileName)
        .subscribe((file) => {
          console.log("image ", file);

          let unsafeImageUrl = URL.createObjectURL(file);
          this.presentStudentImageUrl =
            this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        });
      //mentor
      this.presentStudentMentor = (
        await this.employeeservice
          .getSingleEmployee(this.presentStudent.belongsToEmployeeMongo)
          .toPromise()
      ).employeeObj;
      console.log("mentor :", this.presentStudentMentor);
      //hod
      this.presentStudentHod = (
        await this.hodservice
          .getSingleHod(this.presentStudent.belongsToHodMongo)
          .toPromise()
      ).hodObj;
      console.log("hod :", this.presentStudentHod);
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

  editProfile() {
    this.router.navigateByUrl("v1/student/dashboard/editprofile");
  }
}
