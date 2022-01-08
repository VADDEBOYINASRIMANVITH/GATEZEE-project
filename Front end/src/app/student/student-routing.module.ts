import { ProfileComponent } from "./profile/profile.component";
import { ViewoutpassesComponent } from "./viewoutpasses/viewoutpasses.component";
import { RequestoutpassComponent } from "./requestoutpass/requestoutpass.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home/home.component";
import { PasswordchangeComponent } from "./passwordchange/passwordchange.component";
import { EditprofileComponent } from "./editprofile/editprofile.component";

const routes: Routes = [
  {
    path: "v1/student/dashboard",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      { path: "requestoutpass", component: RequestoutpassComponent },
      { path: "changepassword", component: PasswordchangeComponent },
      { path: "viewoutpass", component: ViewoutpassesComponent },
      { path: "profile", component: ProfileComponent },
      { path: "editprofile", component: EditprofileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
