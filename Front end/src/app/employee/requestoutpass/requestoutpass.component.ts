import { EmployeeOutpassService } from "./../../../../shared-services/employeeoutpass.service";
import { Component, OnInit } from "@angular/core";
//import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

@Component({
  selector: "app-requestoutpass",
  templateUrl: "./requestoutpass.component.html",
  styleUrls: ["./requestoutpass.component.scss"],
  providers: [MessageService],
})
export class RequestoutpassComponent implements OnInit {
  constructor(
    private outpassservice: EmployeeOutpassService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  //today's date
  todayDate: Date = new Date();

  //alert
  alert: boolean = false;

  //close-dialog
  close: boolean = true;

  // public useDefault = false;

  //form validation
  form = new FormGroup({
    oDate: new FormControl("", [Validators.required]),
    oTime: new FormControl("", Validators.required),
    rTime: new FormControl("", Validators.required),
    reason: new FormControl("", Validators.required),
    message: new FormControl("", [
      Validators.required,
      Validators.minLength(20),
    ]),
  });

  //current date
  myDate = Date.now();

  //outgoing date filter
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Sunday from being selected.
    return day !== 0;
  };

  selectedFile: any;
  //reasons
  reasons = [
    "accident of relativs/family members",
    "admission cancelled",
    "Attending funerals of relatives",
    "Attending the sports meet",
    "Attending workshop/seminars etc",
    "CASTING VOTE",
    "COVID-19 Effect",
    "Death of relatives",
    "Festival",
    "Family functions",
    "General Shopping",
    "PASSPORT verification",
    "GATE Exam",
    "NPTEL Exam",
    "Sport meet work",
    "Urgent visit to home",
    "Web Casting",
    "Internship certificate",
    "Internship related",
    "NSS related work",
    "Paper presentation",
    "semester break",
    "Public service exam",
    "Project work related",
    "Placement drive",
    "Cultural festwork",
    "Others",
  ];

  //onSubmit request form
  async onSubmit() {
    if (this.form.valid) {
      let formData = new FormData();
      formData.append("outgoingDate", this.form.value["oDate"]);
      formData.append("outgoingTime", this.form.value["oTime"]);
      formData.append("incomingTime", this.form.value["rTime"]);
      formData.append("reason", this.form.value["reason"]);
      formData.append("description", this.form.value["message"]);
      if (this.selectedFile) formData.append("requestfile", this.selectedFile);

      this.selectedFile = undefined;

      try {
        let result = await this.outpassservice
          .createNewEmployeeOutPass(formData)
          .toPromise();

        this.form.reset();
        this.alert = true;

        this.messageService.add({
          key: "toastElement",
          severity: "success",
          summary: "Success",
          detail: result.message,
          sticky: false,
        });

        await this.sleep(1500);
        //route to view outpass
        this.router.navigateByUrl("v1/employee/dashboard/viewoutpass");
      } catch (error) {
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

  //reset form
  onReset() {
    this.form.reset();
  }

  //file upload
  myUploader(obj) {
    this.selectedFile = obj.files[0];
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
