import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FilterTableComponent } from './components/filter-table/filter-table.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ModalModifiRowComponent } from './components/modal-modifi-row/modal-modifi-row.component';

const routes: Routes =[
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'filter-table', component: FilterTableComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'modal-modifi-row', component: ModalModifiRowComponent  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
