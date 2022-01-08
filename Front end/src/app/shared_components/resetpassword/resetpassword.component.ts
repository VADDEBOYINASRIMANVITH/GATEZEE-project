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
    console.log(idObj);

    try {
      let passObject = {
        password: idObj.password,
        confirmPassword: idObj.confirmPassword,
      };

      console.log(passObject);
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
