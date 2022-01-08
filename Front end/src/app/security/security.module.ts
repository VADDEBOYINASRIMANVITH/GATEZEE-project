import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SecurityRoutingModule } from "./security-routing.module";

//angular material imports
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

//primeng
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { EditorModule } from "primeng/editor";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ChartModule } from "primeng/chart";

//our own
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NavComponent } from "./nav/nav.component";
import { PasswordchangeComponent } from "./passwordchange/passwordchange.component";
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { ScannerComponent } from "./scanner/scanner.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "interceptors/auth-interceptor";
import { ProfileComponent } from './profile/profile.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavComponent,
    PasswordchangeComponent,
    ScannerComponent,
    ProfileComponent,
    EditprofileComponent,
    HomeComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SecurityRoutingModule, // primeng
    ZXingScannerModule,
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
    //material
    MatButtonModule,
    MatGridListModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSlideToggleModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class SecurityModule {}
