import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ngx-chips';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AdminModule } from './features/admin.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TagInputModule,
    SharedModule,
    CoreModule,
    AdminModule,
    AngularFireAuthModule,
    provideFirebaseApp(()=> initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
    
  ],
  providers: [
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
