import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: Observable<any> | undefined;
  loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(
    private firebase: AngularFireAuth,
    private router: Router
  ) {
    this.userData = firebase.authState;
    this.firebase.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn.next(true);
      } else {
        this.loggedIn.next(false);
      } 
    });
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
        console.log('You are Successfully logged in!');
      })
      .catch(err => {
        console.log('Something is wrong:',err.message);
      })
   }

   signOut(){
    this.firebase.signOut();
    this.router.navigate(['login']);
   }

}
