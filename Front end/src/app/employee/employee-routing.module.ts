import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

//our component
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EditprofileComponent } from "./editprofile/editprofile.component";
import { HomeComponent } from "./home/home.component";
import { PasswordchangeComponent } from "./passwordchange/passwordchange.component";
import { ProfileComponent } from "./profile/profile.component";
import { RequestoutpassComponent } from "./requestoutpass/requestoutpass.component";
import { ViewoutpassesComponent } from "./viewoutpasses/viewoutpasses.component";
import { MystudentsComponent } from "./mystudents/mystudents.component";
import { ViewstudentoutpassesComponent } from "./viewstudentoutpasses/viewstudentoutpasses.component";

const routes: Routes = [
  {
    path: "v1/employee/dashboard",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      { path: "requestoutpass", component: RequestoutpassComponent },
      { path: "changepassword", component: PasswordchangeComponent },
      { path: "viewoutpass", component: ViewoutpassesComponent },
      { path: "profile", component: ProfileComponent },
      { path: "editprofile", component: EditprofileComponent },
      { path: "mystudents", component: MystudentsComponent },
      { path: "student/:studentId", component: ViewstudentoutpassesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
