import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { ShuttleComponent } from './pages/shuttle/shuttle.component';
import { DriverComponent } from './pages/driver/driver.component';
import { RegisterDriverComponent } from './pages/register-driver/register-driver.component';
import { RegisterShuttleComponent } from './pages/register-shuttle/register-shuttle.component';

import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { ProfileComponent } from './pages/profile/profile.component';
import { AgmCoreModule } from '@agm/core';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { RouteInformationComponent } from './pages/route-information/route-information.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NewAnnouncementComponent } from './pages/new-announcement/new-announcement.component';
import { AnnouncementInfoComponent } from './pages/announcement-info/announcement-info.component';
import { StudentsComponent } from './pages/students/students.component';
import { StudentInformationComponent } from './pages/student-information/student-information.component';
import { RouteComponent } from './pages/route/route.component';
import { RegisterRouteComponent } from './pages/register-route/register-route.component';
import { ShuttleInformationComponent } from './pages/shuttle-information/shuttle-information.component';

import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import { AdminsComponent } from './pages/admins/admins.component';
import { RegisterAdminComponent } from './pages/register-admin/register-admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; 

@NgModule({
  declarations: [
    ShuttleComponent,
    DriverComponent,
    RegisterDriverComponent,
    RegisterShuttleComponent,
    RouteInformationComponent,
    ProfileComponent,
    AnnouncementsComponent,
    NewAnnouncementComponent,
    AnnouncementInfoComponent,
    StudentsComponent,
    StudentInformationComponent,
    RouteComponent,
    RegisterRouteComponent,
    ShuttleInformationComponent,
    AdminsComponent,
    RegisterAdminComponent,
    DashboardComponent
  ],
  imports: [CommonModule, AgmCoreModule.forRoot({
    apiKey: "AIzaSyAPxN6UrJeSCo6uDciO5EK--QCxo2cvros",
    libraries: ['places'],
  }),
  NgxSpinnerModule,
  SharedModule, AdminRoutingModule, TagInputModule, FormsModule, ReactiveFormsModule, NgxMatFileInputModule, NgxMatTimepickerModule],
  exports: []
})
export class AdminModule {}
