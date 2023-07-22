import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShuttleComponent } from './pages/shuttle/shuttle.component';
import { DriverComponent } from './pages/driver/driver.component';
import { RegisterDriverComponent } from './pages/register-driver/register-driver.component';
import { RegisterShuttleComponent } from './pages/register-shuttle/register-shuttle.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { MoreInformationComponent } from './pages/more-information/more-information.component';
import { NewAnnouncementComponent } from './pages/new-announcement/new-announcement.component';
import { AnnouncementInfoComponent } from './pages/announcement-info/announcement-info.component';
import { StudentsComponent } from './pages/students/students.component';

const routes: Routes = [
  { path: 'shuttle', component: ShuttleComponent, canActivate: [AuthGuard] },
  { path: 'drivers', component: DriverComponent, canActivate: [AuthGuard] },
  { path: 'register-driver', component: RegisterDriverComponent, canActivate: [AuthGuard]},
  { path: 'register-shuttle', component: RegisterShuttleComponent, canActivate: [AuthGuard]},
  { path: 'announcements', component: AnnouncementsComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'more-information', component: MoreInformationComponent, canActivate: [AuthGuard]},
  { path: 'new-announcement', component: NewAnnouncementComponent, canActivate: [AuthGuard]},
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard]},
  { path: 'announcements/announcement-info/:id', component: AnnouncementInfoComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
