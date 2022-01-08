import { EmployeeOutpassService } from "./../../../../shared-services/employeeoutpass.service";
import { StudentOutpassService } from "./../../../../shared-services/studentoutpass.service";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { NotificationService } from "./../../../../shared-services/notification.service";
import { MessageService } from "primeng/api";
import { GlobalService } from "shared-services/global.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-scanner",
  templateUrl: "./scanner.component.html",
  styleUrls: ["./scanner.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})
export class ScannerComponent implements OnInit {
  imageUrl;

  showScanner = true;
  candidateObj: any;

  constructor(
    private notification: NotificationService,
    private messageService: MessageService,
    private studentOutpassService: StudentOutpassService,
    private employeeOutpassService: EmployeeOutpassService,
    private globalService: GlobalService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit() {}

  qrResultString: string;

  clearResult(): void {
    this.qrResultString = null;
  }

  async onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    let reqId = resultString.split(":")[0];
    let designation = resultString.split(":")[1];

    try {
      if (designation == "student") {
        let result = await this.studentOutpassService
          .authenticateStudentOutpassBySecurity(reqId)
          .toPromise();

        console.log("result :", result);
        //getting the info
        this.showScanner = false;
        this.candidateObj = result.studentObj;

        //getting the photo of the candidate
        let imagefile = await this.globalService
          .getUserImage(result.studentObj.imageFileName)
          .toPromise();
        console.log("image ", imagefile);
        let unsafeImageUrl = URL.createObjectURL(imagefile);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        
        //
        this.messageService.add({
          key: "toastElement",
          severity: "success",
          summary: "Success",
          detail: "Allow the Student",
          sticky: false,
        });
      } else {
        let result = await this.employeeOutpassService
          .authenticateEmployeeOutpassBySecurity(reqId)
          .toPromise();

        console.log("result :", result);
        //getting the info
        this.showScanner = false;
        this.candidateObj = result.employeeObj;

        //getting the photo of the candidate
        let imagefile = await this.globalService
          .getUserImage(result.employeeObj.imageFileName)
          .toPromise();
        console.log("image ", imagefile);
        let unsafeImageUrl = URL.createObjectURL(imagefile);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        
        //
        this.messageService.add({
          key: "toastElement",
          severity: "success",
          summary: "Success",
          detail: "Allow the Employee",
          sticky: false,
        });
      }
    } catch (error) {
      console.log("in catch block");
      console.log(error);
      this.messageService.add({
        key: "toastElement",
        severity: "error",
        summary: "Invalid QR ERROR",
        detail: error.error.message,
        sticky: false,
      });

      //routing
    }
  }

  showScannerOnClick() {
    this.showScanner = true;
  }
}
