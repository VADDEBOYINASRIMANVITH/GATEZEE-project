import { QrcodedialogboxComponent } from "./../src/app/student/qrcodedialogbox/qrcodedialogbox.component";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Injectable({ providedIn: "root" })
export class MatDialogService {
  constructor(private dialog: MatDialog) {}

  openQRCodeDialog(msg: string) {
    return this.dialog.open(QrcodedialogboxComponent, {
      width: "390px",
      panelClass: "confirm-dialog-container",
      disableClose: false,
      data: {
        message: msg,
      },
    });
  }
}
