import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { QrScannerComponent } from "angular2-qrscanner";

@Component({
  selector: "app-scanner",
  templateUrl: "./scanner.component.html",
  styleUrls: ["./scanner.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ScannerComponent implements OnInit {
  @ViewChild(QrScannerComponent, { static: false })
  qrScannerComponent: QrScannerComponent;
  // constructor() { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.qrScannerComponent.getMediaDevices().then((devices) => {
      console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === "videoinput") {
          videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        let choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes("front")) {
            choosenDev = dev;
            break;
          }
        }
        if (choosenDev) {
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
        }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe((result) => {
      console.log(result);
    });
  }
}

/*
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { GlobalService } from "shared-services/global.service";

@Component({
  selector: "app-resetpassword",
  templateUrl: "./resetpassword.component.html",
  styleUrls: ["./resetpassword.component.scss"],
  providers: [MessageService],
})
export class ResetpasswordComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private globalService: GlobalService,
    private route: ActivatedRoute
  ) {}

  resetPasswordToken: string;
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.resetPasswordToken = paramMap.get("passwordresettoken");
    });
  }

  async onSubmit(idObj) {
    try {
      let passObject = {
        password: idObj.password,
        confirmPassword: idObj.confirmPassword,
      };
      let result = await this.globalService
        .resetPassword(passObject, this.resetPasswordToken)
        .toPromise();

      this.messageService.add({
        key: "toastElement",
        severity: "success",
        summary: "Success",
        detail: result.message,
        sticky: false,
      });
    } catch (error) {
      console.log("in catch block");
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
}
*/

/**<!-- <p-toast position="top-center" key="toastElement"></p-toast> -->
<div class="wrapper fadeInDown">
  <div id="formContent">
    <!-- Tabs Titles -->
    <h2>Reset Your Password</h2>

    <!-- Icon -->
    <div class="fadeIn first">
      <img
        src="../../assets/reset-password-icon-16.jpg"
        id="icon"
        alt="Resetpassword Icon Icon"
      />
    </div>

    <form ngForm #ref="ngForm"></form>

    <!-- Login Form -->
    <form ngForm #ref="ngForm" (ngSubmit)="onSubmit(ref.value); ref.reset()">
      <input
        type="password"
        id="password"
        class="fadeIn second"
        name="password"
        placeholder="New Password*"
        ngModel
        required
      />

      <input
        type="password"
        id="password"
        class="fadeIn second"
        name="confirmPassword"
        placeholder="Confirm New Password*"
        ngModel
        required
      />

      <input type="submit" class="fadeIn fourth" value="Reset Password" />
    </form>

    <!-- Remind Passowrd -->
    <div id="formFooter">
      <a class="underlineHover" href="v1/login">Back to Login</a>
    </div>
  </div>
</div>
*/
