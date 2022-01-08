import { ViewemployeeoutpassesComponent } from "./viewemployeeoutpasses/viewemployeeoutpasses.component";
import { MyeemployeesComponent } from "./myeemployees/myeemployees.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EditprofileComponent } from "./editprofile/editprofile.component";
import { HomeComponent } from "./home/home.component";
import { MystudentsComponent } from "./mystudents/mystudents.component";
import { PasswordchangeComponent } from "./passwordchange/passwordchange.component";
import { ProfileComponent } from "./profile/profile.component";
import { ViewstudentoutpassesComponent } from "./viewstudentoutpasses/viewstudentoutpasses.component";

const routes: Routes = [
  {
    path: "v1/hod/dashboard",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      { path: "changepassword", component: PasswordchangeComponent },
      { path: "profile", component: ProfileComponent },
      { path: "editprofile", component: EditprofileComponent },
      { path: "mystudents", component: MystudentsComponent },
      { path: "student/:studentId", component: ViewstudentoutpassesComponent },
      { path: "myemployees", component: MyeemployeesComponent },
      {
        path: "employee/:employeeId",
        component: ViewemployeeoutpassesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HodRoutingModule {}
