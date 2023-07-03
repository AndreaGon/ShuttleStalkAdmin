import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Toast from 'awesome-toast-component';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(
    private firebase: AngularFireAuth
  ) {}

  signUpDriver(email: string, password: string): any{
    
    this.firebase.createUserWithEmailAndPassword(email, password).then(res => {
        console.log('You are Successfully signed up!', res);
        return true;
      })
      .catch(error =>{
        console.log('Something is wrong:', error.message);
        new Toast("Error: " + error.message, {
          position: 'top',
          theme: 'light'
        });
        return false;
      });
  }

}
