import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { GlobalService } from "shared-services/global.service";

@Component({
  selector: "app-passwordchange",
  templateUrl: "./passwordchange.component.html",
  styleUrls: ["./passwordchange.component.scss"],
  providers: [MessageService],
})
export class PasswordchangeComponent implements OnInit {
  constructor(
    private globalService: GlobalService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  async onSubmit(formObj) {
    console.log(formObj);

    try {
      let passObject = {
        oldPassword: formObj.currentPassword,
        newPassword: formObj.newPassword,
      };

      console.log(passObject);
      let result = await this.globalService
        .changePassword(passObject)
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
