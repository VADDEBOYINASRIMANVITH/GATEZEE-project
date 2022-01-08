import { environment } from "../src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: "root" })
export class HodService {
  private apiBaseUrl: string = environment.apiBaseUrl + "hod/";

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  createNewHod(HodObj) {
    let api = this.apiBaseUrl;
    return this.http.post<{ message: string }>(api, HodObj);
  }

  getSingleHod(HodId) {
    let api = this.apiBaseUrl + `${HodId}`;
    return this.http.get<{ message: string; hodObj: any }>(api);
  }

  getAllHods() {
    let api = this.apiBaseUrl;
    return this.http.get<{ message: string; allHodsObj: any }>(api);
  }

  updateSingleHod(HodId, body) {
    /*by Hod
    Hod : change his details like {email,phone,imageFile}
    */
    let api = this.apiBaseUrl + `${HodId}`;
    return this.http.patch<{ message: string }>(api, body);
  }

  deleteSingleHod(HodId, body) {
    /*only by admin
      {status:resigned,active,intern}
    */
    let api = this.apiBaseUrl + `${HodId}`;
    return this.http.delete<{ message: string }>(api, body);
  }
}
