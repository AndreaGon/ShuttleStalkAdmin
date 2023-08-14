import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';


import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    LoginComponent,
    HeaderComponent
  ],
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule, HttpClientModule],
  exports: [LoginComponent, HeaderComponent]
})
export class CoreModule {}
