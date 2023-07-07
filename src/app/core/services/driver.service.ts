import { Injectable } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Driver } from '../models/driver.model';

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(
    private firestore: Firestore
  ) {}

  collection: any = collection(this.firestore, "drivers");  
  

  async signUpDriver(account: Driver): Promise<any>{

    let newDriver: any = await addDoc(this.collection, {
      email: account.email,
      fullname: account.fullname,
      icNumber: account.icNumber,
      role: account.role,
      password: window.btoa(account.password)
    });
  
    return updateDoc(newDriver, {
      id: newDriver.id
    });
  }

  async checkExistingDriver(email: any){
    const q = query(this.collection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return await querySnapshot;
  }

  async getAllDriverAccounts(){
    const q = query(this.collection, where("role", "==", "DRIVER"));
    const querySnapshot = await getDocs(q);
    return await querySnapshot;
  }

  async deleteDriver(id: string){
    return deleteDoc(doc(this.firestore, "drivers", id));
  }
}
