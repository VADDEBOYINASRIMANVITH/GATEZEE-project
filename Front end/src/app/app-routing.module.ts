import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

//own components
import { ResetpasswordComponent } from "./shared_components/resetpassword/resetpassword.component";
import { ForgotpasswordComponent } from "./shared_components/forgotpassword/forgotpassword.component";
import { LoginComponent } from "./shared_components/login/login.component";
import { ScannerComponent } from "./shared_components/scanner/scanner.component";

const routes: Routes = [
  { path: "", redirectTo: "v1/login", pathMatch: "full" },
  { path: "v1/login", component: LoginComponent },
  { path: "v1/scanner", component: ScannerComponent },
  { path: "v1/forgotpassword", component: ForgotpasswordComponent },
  {
    path: "v1/resetpassword/:passwordresettoken",
    component: ResetpasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
