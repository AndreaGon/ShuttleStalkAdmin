import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { BehaviorSubject, Observable } from 'rxjs';

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
  ) {
    this.autoLogin();
  }

   signUp(email: string, password: string){
    this.firebase.createUserWithEmailAndPassword(email, password).then(res => {
      console.log('You are Successfully signed up!', res);
    })
    .catch(error =>{
      console.log('Something is wrong:', error.message);
    });
   }

   signIn(email: string, password: string){
      this.firebase.signInWithEmailAndPassword(email, password)
      .then(res => {
        this.router.navigate(["shuttle"]);
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
    this.router.navigate(['login']);
   }

   autoLogin(){
    this.firebase.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        this.loggedIn.next(true);

        if(this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
        }
      } else {
        this.loggedIn.next(false);
      } 
    });
   }

   getEmail(){
    return JSON.parse(localStorage.getItem("user")!);
   }

}
