import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "primeng/api";
import { GlobalService } from "shared-services/global.service";
import { HodService } from "shared-services/hod.service";
import { StudentService } from "shared-services/student.service";
import { StudentOutpassService } from "shared-services/studentoutpass.service";

@Component({
  selector: "app-studentprofiledialog",
  templateUrl: "./studentprofiledialog.component.html",
  styleUrls: ["./studentprofiledialog.component.scss"],
  providers: [MessageService],
})
export class StudentprofiledialogComponent implements OnInit {
  presentStudentImageUrl: any;
  presentEmployee: any;
  presentStudent: any;
  presentStudentHod: any;
  piedata: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private globalservice: GlobalService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private studentservice: StudentService,
    private hodservice: HodService,
    private studentoutpassservice: StudentOutpassService
  ) {}

  async ngOnInit() {
    try {
      this.presentEmployee = await this.globalservice.getUserBasedOnToken();
      this.presentStudent = (
        await this.studentservice.getSingleStudent(this.data).toPromise()
      ).studentObj;

      this.globalservice
        .getUserImage(this.presentStudent.imageFileName)
        .subscribe((file) => {
          let unsafeImageUrl = URL.createObjectURL(file);
          this.presentStudentImageUrl =
            this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        });

      //hod
      this.presentStudentHod = (
        await this.hodservice
          .getSingleHod(this.presentStudent.belongsToHodMongo)
          .toPromise()
      ).hodObj;

      let presentStudentOutpasses = (
        await this.studentoutpassservice
          .getStudentAllOutPasses(this.presentStudent._id)
          .toPromise()
      ).allStudentOutPasses;

      this.updatePieChartData(presentStudentOutpasses);
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

  updatePieChartData(presentStudentOutpasses) {
    let accepted = presentStudentOutpasses.filter(
      (el) => el.status == "accepted"
    ).length;
    let pending = presentStudentOutpasses.filter(
      (el) => el.status == "pending"
    ).length;
    let cancelled = presentStudentOutpasses.filter(
      (el) => el.status == "cancelled"
    ).length;
    let unread = presentStudentOutpasses.filter(
      (el) => el.status == "unread"
    ).length;
    let rejected = presentStudentOutpasses.filter(
      (el) => el.status == "rejected"
    ).length;
    let deleted = presentStudentOutpasses.filter(
      (el) => el.status == "deleted"
    ).length;

    // console.log("ac", accepted);
    // console.log("pn", pending);
    // console.log("ur", unread);
    // console.log("canc", cancelled);
    // console.log("rej", rejected);
    // console.log("del", deleted);

    this.piedata = {
      labels: [
        "Pending",
        "Accepted",
        "Cancelled",
        "Unread",
        "Rejected",
        "Deleted",
      ],
      datasets: [
        {
          data: [pending, accepted, cancelled, unread, rejected, deleted],
          backgroundColor: [
            "#FF6384",
            "#32CD32",
            "#FFCE56",
            "#36A2EB",
            "#FFA500",
            "#000000",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#32CD32",
            "#FFCE56",
            "#36A2EB",
            "#FFA500",
            "#000000",
          ],
        },
      ],
    };
  }
}
