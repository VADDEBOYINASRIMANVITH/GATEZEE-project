import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-qrcodedialogbox",
  templateUrl: "./qrcodedialogbox.component.html",
  styleUrls: ["./qrcodedialogbox.component.scss"],
})
export class QrcodedialogboxComponent implements OnInit {
  qrdata: string;
  constructor(
    public dialogRef: MatDialogRef<QrcodedialogboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.qrdata = data.message;
    console.log(this.qrdata);
  }

  ngOnInit(): void {}

  onCloseDialog() {
    this.dialogRef.close(null);
  }
}
