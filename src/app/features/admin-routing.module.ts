import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShuttleComponent } from './pages/shuttle/shuttle.component';
import { DriverComponent } from './pages/driver/driver.component';
import { RegisterDriverComponent } from './pages/register-driver/register-driver.component';
import { RegisterShuttleComponent } from './pages/register-shuttle/register-shuttle.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { RouteInformationComponent } from './pages/route-information/route-information.component';
import { NewAnnouncementComponent } from './pages/new-announcement/new-announcement.component';
import { AnnouncementInfoComponent } from './pages/announcement-info/announcement-info.component';
import { StudentsComponent } from './pages/students/students.component';
import { StudentInformationComponent } from './pages/student-information/student-information.component';
import { RouteComponent } from './pages/route/route.component';
import { RegisterRouteComponent } from './pages/register-route/register-route.component';
import { ShuttleInformationComponent } from './pages/shuttle-information/shuttle-information.component';
import { AdminsComponent } from './pages/admins/admins.component';
import { RegisterAdminComponent } from './pages/register-admin/register-admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'shuttle', component: ShuttleComponent, canActivate: [AuthGuard] },
  { path: 'route', component: RouteComponent, canActivate: [AuthGuard] },
  { path: 'drivers', component: DriverComponent, canActivate: [AuthGuard] },
  { path: 'register-driver', component: RegisterDriverComponent, canActivate: [AuthGuard]},
  { path: 'register-shuttle', component: RegisterShuttleComponent, canActivate: [AuthGuard]},
  { path: 'register-route', component: RegisterRouteComponent, canActivate: [AuthGuard]},
  { path: 'announcements', component: AnnouncementsComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'route-information', component: RouteInformationComponent, canActivate: [AuthGuard]},
  { path: 'shuttle-information', component: ShuttleInformationComponent, canActivate: [AuthGuard]},
  { path: 'new-announcement', component: NewAnnouncementComponent, canActivate: [AuthGuard]},
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard]},
  { path: 'announcements/announcement-info/:id', component: AnnouncementInfoComponent, canActivate: [AuthGuard]},
  { path: 'students/student-info/:id', component: StudentInformationComponent, canActivate: [AuthGuard]},
  { path: 'admins', component: AdminsComponent, canActivate: [AuthGuard]},
  { path: 'register-admin', component: RegisterAdminComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
