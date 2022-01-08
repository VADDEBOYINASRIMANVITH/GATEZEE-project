//import { AuthService } from "./../src/app/auth.service";

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable() //just like service but differently provided
export class AuthInterceptor implements HttpInterceptor {
  constructor() {} //to get token
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const gpmstoken = localStorage.getItem("GPMSTOKEN");

    const authReq = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + gpmstoken),
    });

    return next.handle(authReq);
  }
}
