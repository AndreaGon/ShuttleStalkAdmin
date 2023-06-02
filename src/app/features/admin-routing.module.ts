import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShuttleComponent } from './pages/shuttle/shuttle.component';
import { DriverComponent } from './pages/driver/driver.component';
import { RegisterDriverComponent } from './pages/register-driver/register-driver.component';

const routes: Routes = [
  { path: 'shuttle', component: ShuttleComponent },
  { path: 'drivers', component: DriverComponent },
  { path: 'register-driver', component: RegisterDriverComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
