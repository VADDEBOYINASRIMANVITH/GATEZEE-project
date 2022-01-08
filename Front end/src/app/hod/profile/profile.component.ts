import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { GlobalService } from "shared-services/global.service";
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
    private sanitizer: DomSanitizer
  ) {}
  presentHod: any;
  presentHodImageUrl;

  async ngOnInit() {
    try {
      this.presentHod = await this.globalservice.getUserBasedOnToken();

      this.globalservice
        .getUserImage(this.presentHod.imageFileName)
        .subscribe((file) => {
          console.log("image ", file);

          let unsafeImageUrl = URL.createObjectURL(file);
          this.presentHodImageUrl =
            this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        });
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
    this.router.navigateByUrl("v1/hod/dashboard/editprofile");
  }
}
