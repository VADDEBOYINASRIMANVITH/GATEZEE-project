import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

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

//our components
import { AuthInterceptor } from "interceptors/auth-interceptor";
import { HodRoutingModule } from "./hod-routing.module";
import { PasswordchangeComponent } from "./passwordchange/passwordchange.component";
import { MystudentsComponent } from "./mystudents/mystudents.component";
import { MyeemployeesComponent } from "./myeemployees/myeemployees.component";
import { ViewemployeeoutpassesComponent } from "./viewemployeeoutpasses/viewemployeeoutpasses.component";
import { ViewstudentoutpassesComponent } from "./viewstudentoutpasses/viewstudentoutpasses.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { StudentoutpassdialogboxComponent } from './studentoutpassdialogbox/studentoutpassdialogbox.component';
import { EmployeeoutpassdialogboxComponent } from './employeeoutpassdialogbox/employeeoutpassdialogbox.component';
import { StudentprofiledialogComponent } from './studentprofiledialog/studentprofiledialog.component';
import { EmployeeprofiledialogComponent } from './employeeprofiledialog/employeeprofiledialog.component';

@NgModule({
  declarations: [
    PasswordchangeComponent,
    MystudentsComponent,
    MyeemployeesComponent,
    ViewemployeeoutpassesComponent,
    ViewstudentoutpassesComponent,
    DashboardComponent,
    NavComponent,
    HomeComponent,
    ProfileComponent,
    EditprofileComponent,
    StudentoutpassdialogboxComponent,
    EmployeeoutpassdialogboxComponent,
    StudentprofiledialogComponent,
    EmployeeprofiledialogComponent,
  ],
  imports: [
    CommonModule,
    HodRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,

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
export class HodModule {}
