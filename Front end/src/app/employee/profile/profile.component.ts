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
    private hodservice: HodService,
    private sanitizer: DomSanitizer
  ) {}
  presentMentor: any;
  presentMentorImageUrl;
  presentMentorHod: any;

  async ngOnInit() {
    try {
      this.presentMentor = await this.globalservice.getUserBasedOnToken();

      this.globalservice
        .getUserImage(this.presentMentor.imageFileName)
        .subscribe((file) => {
          console.log("image ", file);

          let unsafeImageUrl = URL.createObjectURL(file);
          this.presentMentorImageUrl =
            this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        });
      //hod
      this.presentMentorHod = (
        await this.hodservice
          .getSingleHod(this.presentMentor.belongsToHodMongo)
          .toPromise()
      ).hodObj;

      console.log("hod :", this.presentMentorHod);
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
    this.router.navigateByUrl("v1/employee/dashboard/editprofile");
  }
}
