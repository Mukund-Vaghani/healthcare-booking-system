import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AddAvailabilityComponent } from './component/dashboard/add-availability/add-availability.component';
import { BookAppointmentComponent } from './component/dashboard/book-appointment/book-appointment.component';
import { HomeComponent } from './component/dashboard/home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, 
  children:[
    {path:'',component:HomeComponent},
      {path:'add-availability', component:AddAvailabilityComponent},
      {path:'book-appointment',component:BookAppointmentComponent},
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
