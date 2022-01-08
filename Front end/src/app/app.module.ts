// own modules
import { StudentModule } from "./student/student.module";
import { SecurityModule } from "./security/security.module";
import { EmployeeModule } from "./employee/employee.module";
import { HodModule } from "./hod/hod.module";
import { AdminModule } from "./admin/admin.module";

// angular
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { LayoutModule } from "@angular/cdk/layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QRCodeModule } from "angularx-qrcode";
import { NgQrScannerModule } from "angular2-qrscanner";

// our components
import { LoginComponent } from "./shared_components/login/login.component";
import { AppComponent } from "./app.component";
import { ScannerComponent } from "./shared_components/scanner/scanner.component";
import { ForgotpasswordComponent } from "./shared_components/forgotpassword/forgotpassword.component";
import { ResetpasswordComponent } from "./shared_components/resetpassword/resetpassword.component";

// primeng
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { EditorModule } from "primeng/editor";
import { ToastModule } from "primeng/toast";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { FileUploadModule } from "primeng/fileupload";
import { ChartModule } from "primeng/chart";

// Material
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { AuthInterceptor } from "interceptors/auth-interceptor";
import { ZXingScannerModule } from "@zxing/ngx-scanner";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ScannerComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule,
    NgQrScannerModule,
    ZXingScannerModule,

    // primeng
    InputTextModule,
    DropdownModule,
    TableModule,
    ButtonModule,
    EditorModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    FileUploadModule,
    ChartModule,
    // material
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    MatDividerModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatRadioModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    NgxMaterialTimepickerModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatSlideToggleModule,
    // own modules
    StudentModule,
    SecurityModule,
    EmployeeModule,
    HodModule,
    AdminModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
