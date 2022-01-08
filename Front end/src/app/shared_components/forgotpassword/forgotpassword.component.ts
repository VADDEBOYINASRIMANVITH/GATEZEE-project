import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { GlobalService } from "shared-services/global.service";

@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.component.html",
  styleUrls: ["./forgotpassword.component.scss"],
  providers: [MessageService],
})
export class ForgotpasswordComponent implements OnInit {
  constructor(
    private globalService: GlobalService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  async onSubmit(idObj) {
    try {
      let idObject = { Id: idObj.Id };
      let result = await this.globalService
        .forgotPassword(idObject)
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
