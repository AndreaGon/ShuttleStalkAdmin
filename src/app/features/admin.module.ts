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
import { MoreInformationComponent } from './pages/more-information/more-information.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NewAnnouncementComponent } from './pages/new-announcement/new-announcement.component';
import { AnnouncementInfoComponent } from './pages/announcement-info/announcement-info.component';
import { StudentsComponent } from './pages/students/students.component';

@NgModule({
  declarations: [
    ShuttleComponent,
    DriverComponent,
    RegisterDriverComponent,
    RegisterShuttleComponent,
    MoreInformationComponent,
    ProfileComponent,
    AnnouncementsComponent,
    NewAnnouncementComponent,
    AnnouncementInfoComponent,
    StudentsComponent
  ],
  imports: [CommonModule, AgmCoreModule.forRoot({
    apiKey: "AIzaSyBPOUA1S51D3-RZnahp5ZeXEbmIs4iMmmI",
    libraries: ['places'],
  }),
  NgxSpinnerModule,
  SharedModule, AdminRoutingModule, TagInputModule, FormsModule, ReactiveFormsModule, NgxMatFileInputModule],
  exports: []
})
export class AdminModule {}
