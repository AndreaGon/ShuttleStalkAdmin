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
        this.redirectUrl = "dashboard";
        this.autoLogin();
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

   async autoLogin(){
    return this.firebase.onAuthStateChanged(async (user) => {
      var userEmail = user?.email;
      await this.adminService.getAdminByEmail(userEmail).subscribe((userRole)=>{
      
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("role", JSON.stringify(userRole[0].role))
          this.loggedIn.next(true);

          console.log("IS CALLED")
  
          if(this.redirectUrl && this.getRole() != null) {
            console.log(this.getRole());
            this.router.navigate([this.redirectUrl]);
          }
          
        } else {

          console.log("IS FALSE")
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

   checkLocalStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      const check = this.getRole();
      if (check) {
        resolve(true);
      } else {
        this.checkLocalStorage();
      }
    });
  }


}
