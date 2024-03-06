import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FilterTableComponent } from './components/filter-table/filter-table.component';
import { ModalModifiRowComponent } from './components/modal-modifi-row/modal-modifi-row.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TimerService } from "./services/services/timer.service";
import { DatePipe } from "@angular/common";
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AppComponent,
    AppComponent,
    LoginComponent,
    DashboardComponent,
    FilterTableComponent,
    ModalModifiRowComponent
  ],
  imports: [
    BrowserModule,AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgxPaginationModule,

  ],
  providers: [
    TimerService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
