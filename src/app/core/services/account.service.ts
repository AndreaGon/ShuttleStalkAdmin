import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { Firestore, collectionData, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private firestore: Firestore
  ) {}

  collection: any = collection(this.firestore, "account");

  async addNewAccount(account: Account){
    let newDriver: any = await addDoc(this.collection, {
      email: account.email,
      fullname: account.fullname,
      icNumber: account.icNumber,
      role: account.role,
      accountId: account.accountId
    });
  
    return updateDoc(newDriver, {
      id: newDriver.id
    });
  }

  async getAllDriverAccounts(){
    const q = query(this.collection, where("role", "==", "DRIVER"));
    const querySnapshot = await getDocs(q);
    return await querySnapshot;
  }

  async deleteDriverAccount(id: string){
    return deleteDoc(doc(this.firestore, "account", id));
  }

}
