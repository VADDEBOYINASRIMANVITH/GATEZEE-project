import { GlobalService } from "shared-services/global.service";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "primeng/api";
import { StudentOutpassService } from "shared-services/studentoutpass.service";
import { Router } from "@angular/router";
import { MatDialogService } from "shared-services/mat-dialog.service";

@Component({
  selector: "app-outpassdialogbox",
  templateUrl: "./outpassdialogbox.component.html",
  styleUrls: ["./outpassdialogbox.component.scss"],
  providers: [MessageService],
})
export class OutpassdialogboxComponent implements OnInit {
  imageUrl: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private globalservice: GlobalService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private studentoutpassservice: StudentOutpassService,
    private router: Router,
    private matdialogservice: MatDialogService
  ) {
    console.log("outpass data :", data);

    //getting the photo of the outpass supporting document
    this.globalservice.getUserFile(data.fileName).subscribe((file) => {
      console.log("image ", file);

      let unsafeImageUrl = URL.createObjectURL(file);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
    });
  }

  async deleteOutPass() {
    try {
      let message = (
        await this.studentoutpassservice
          .deleteSingleStudentOutPass(this.data._id)
          .toPromise()
      ).message;

      this.messageService.add({
        key: "toastElement",
        severity: "success",
        summary: "Success",
        detail: message,
        sticky: false,
      });
      await this.sleep(1000);
      this.reloadCurrentRoute();
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

  async cancelOutPass() {
    try {
      let message = (
        await this.studentoutpassservice
          .cancelSingleStudentOutPass(this.data._id)
          .toPromise()
      ).message;

      this.messageService.add({
        key: "toastElement",
        severity: "success",
        summary: "Success",
        detail: message,
        sticky: false,
      });
      await this.sleep(1000);
      this.reloadCurrentRoute();
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

  openQRCode(outpass_id) {
    console.log("QR code");

    let msg = outpass_id + ":student";

    this.matdialogservice.openQRCodeDialog(msg);
  }

  ngOnInit(): void {}

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
