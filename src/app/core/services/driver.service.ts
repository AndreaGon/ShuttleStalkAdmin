import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Toast from 'awesome-toast-component';
import { AccountService } from './account.service';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(
    private firebase: AngularFireAuth,
    private accountService: AccountService
  ) {}
  

  async signUpDriver(email: string, password: string, account: Account): Promise<any>{
    
    await this.firebase.createUserWithEmailAndPassword(email, password).then(res => {
      account.accountId = res.user?.uid;
      this.accountService.addNewAccount(account).then((res)=>{
        new Toast("Driver successfully added!", {
          position: 'top',
          theme: 'light'
        });
      });
        return;
      })
      .catch(error =>{
        console.log('Something is wrong:', error.message);
        new Toast("Error: " + error.message, {
          position: 'top',
          theme: 'light'
        });
        return;
      });
  }

  deleteDriver(id: string, accountId: string){
    //TODO: Delete account from Firebase Auth
    this.accountService.deleteDriverAccount(id);
  }
}
