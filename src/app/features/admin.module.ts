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
import { MoreInformationComponent } from './pages/more-information/more-information.component';
import { EditShuttleComponent } from './pages/edit-shuttle/edit-shuttle.component';

import { NgxMatFileInputModule } from '@angular-material-components/file-input';

@NgModule({
  declarations: [
    ShuttleComponent,
    DriverComponent,
    RegisterDriverComponent,
    RegisterShuttleComponent,
    MoreInformationComponent,
    EditShuttleComponent
  ],
  imports: [CommonModule, SharedModule, AdminRoutingModule, TagInputModule, FormsModule, ReactiveFormsModule, NgxMatFileInputModule],
  exports: []
})
export class AdminModule {}
