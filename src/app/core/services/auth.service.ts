import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminService } from './admin.service';

const API_URL = environment.api_url + "/admins";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn = new BehaviorSubject<any>(null);
  loggedIn$ = this.loggedIn.asObservable();

  redirectUrl = "";

  constructor(
    private firebase: AngularFireAuth,
    private router: Router,
    private http: HttpClient,
    private adminService: AdminService
  ) {
    this.autoLogin();
  }

   signIn(email: string, password: string){
      this.firebase.signInWithEmailAndPassword(email, password)
      .then(res => {
        this.router.navigate(["dashboard"]);
        new Toast("Successfully logged in!", {
          position: 'top',
          theme: 'light'
        });
      })
      .catch(error => {
        new Toast("Error: " + error.message, {
          position: 'top',
          theme: 'light'
        });
      })
   }

   signOut(){
    this.firebase.signOut();
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    this.router.navigate(['login']);
   }

   autoLogin(){
    this.firebase.onAuthStateChanged((user) => {
      var userEmail = user?.email;
      this.adminService.getAdminByEmail(userEmail).subscribe((userRole)=>{
      
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("role", JSON.stringify(userRole[0].role))
          this.loggedIn.next(true);
  
          if(this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
          }
        } else {
          this.loggedIn.next(false);
        } 
      });
    });
   }

   async checkExistingAdmin(email: String){
    return this.http.get<any[]>(`${API_URL}/get-admin/${email}`);
   }

   getUser(){
      return JSON.parse(localStorage.getItem("user")!);
   }

   getRole(){
    return JSON.parse(localStorage.getItem("role")!);
   }

}
