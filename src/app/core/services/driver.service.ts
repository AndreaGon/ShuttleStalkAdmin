import { Injectable } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Driver } from '../models/driver.model';

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_URL = environment.api_url + "/drivers";


@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(
    private firestore: Firestore,
    private http: HttpClient
  ) {}

  collection: any = collection(this.firestore, "drivers");  
  

  async signUpDriver(account: Driver): Promise<any>{
    let newAccount = {
      fullname: account.fullname,
      icNumber: account.icNumber,
      email: account.email, 
      password: account.password
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${API_URL}/register-driver`, newAccount, { headers: headers });
  }

  async checkExistingDriver(email: any){
    const q = query(this.collection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return await querySnapshot;
  }

  getAllDriverAccounts(){
    // const q = query(this.collection, where("role", "==", "DRIVER"));
    // const querySnapshot = await getDocs(q);
    // return await querySnapshot;

    return this.http.get<any[]>(`${API_URL}/get-drivers`);
  }

  async deleteDriver(id: string){
    return deleteDoc(doc(this.firestore, "drivers", id));
  }
}
