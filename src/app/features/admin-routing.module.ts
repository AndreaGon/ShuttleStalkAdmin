import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShuttleComponent } from './pages/shuttle/shuttle.component';
import { DriverComponent } from './pages/driver/driver.component';
import { RegisterDriverComponent } from './pages/register-driver/register-driver.component';
import { RegisterShuttleComponent } from './pages/register-shuttle/register-shuttle.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'shuttle', component: ShuttleComponent, canActivate: [AuthGuard] },
  { path: 'drivers', component: DriverComponent, canActivate: [AuthGuard] },
  { path: 'register-driver', component: RegisterDriverComponent, canActivate: [AuthGuard]},
  { path: 'register-shuttle', component: RegisterShuttleComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
