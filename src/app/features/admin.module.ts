import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { ShuttleComponent } from './pages/shuttle/shuttle.component';
import { DriverComponent } from './pages/driver/driver.component';
import { RegisterDriverComponent } from './pages/register-driver/register-driver.component';

@NgModule({
  declarations: [
    ShuttleComponent,
    DriverComponent,
    RegisterDriverComponent
  ],
  imports: [CommonModule, SharedModule, AdminRoutingModule],
  exports: []
})
export class AdminModule {}
