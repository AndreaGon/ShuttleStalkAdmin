import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private firestore: Firestore
  ) {}

  collection: any = collection(this.firestore, "account");

  addNewAccount(account: Account){
    return setDoc(doc(this.collection), {
        email: account.email,
        fullname: account.fullname,
        icNumber: account.icNumber,
        role: account.role
    });
  }

}
