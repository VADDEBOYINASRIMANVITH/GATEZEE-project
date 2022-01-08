import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { MessageService } from "primeng/api/";
@Injectable({ providedIn: "root" })
export class NotificationService {
  constructor(public snackBar: MatSnackBar) {}

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: "center",
    verticalPosition: "top",
  };

  success(msg) {
    this.config.panelClass = ["notification", "success"];
    this.snackBar.open(msg, "", this.config);
  }

  danger(msg) {
    this.config.panelClass = ["notification", "danger"];
    this.snackBar.open(msg, "", this.config);
  }

  warn(msg) {
    this.config.panelClass = ["notification", "warn"];
    this.snackBar.open(msg, "", this.config);
  }
}
