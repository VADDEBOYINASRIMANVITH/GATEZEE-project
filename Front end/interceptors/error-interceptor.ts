//import { AuthService } from "./src/app/auth.service";
import { Router } from "@angular/router";
//import { ErrorComponent } from "./src/app/errors/error/error.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";

import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private dialog: MatDialog,
    private router: Router //private authservice: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An Unknown Error Occured!";

        if (error.error.message) {
          errorMessage = error.error.message;
        }

        // this.dialog.open(ErrorComponent, {
        //   data: { message: errorMessage },
        //   width: "300px",
        //   disableClose: false,
        // });
        // .afterClosed()
        // .subscribe(() => {
        //   this.authservice.loggedInSubject.next(false);
        //   this.authservice.clearCacheAndRedirect();
        //   this.router.navigateByUrl("/users/login");
        // });
        return throwError(error);
      })
    );
  }
}
