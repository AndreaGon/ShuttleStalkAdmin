import { Injectable } from '@angular/core';

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Shuttle } from '../models/shuttle.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShuttleService {

  constructor(
    private firestore: Firestore,
    private storage: AngularFireStorage
  ) {}

  collection: any = collection(this.firestore, "shuttles");

  async getAllShuttles(): Promise<any>{
    const querySnapshot = await getDocs(this.collection);

    let documents: any[] = [];
    querySnapshot.forEach((doc)=>{
      documents.push(doc.data());
    });

    return documents;
  }

  async getShuttleOnQuery(id: string): Promise<any>{
    const q = query(this.collection, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    return await querySnapshot;
  }

  async addNewShuttle(shuttle: Shuttle): Promise<any>{
    let newShuttle: any = await addDoc(this.collection, {
        plateNo: shuttle.plateNo,
        shuttleImage: shuttle.shuttleImage,
        routeName: shuttle.routeName,
        driver: shuttle.driver,
        pickupTime: shuttle.pickupTime,
        dropoffTime: shuttle.dropoffTime,
        route: shuttle.route
      });
    
      return updateDoc(newShuttle, {
        id: newShuttle.id
      });
  }

  async updateShuttle(shuttle: Shuttle, shuttleId: string): Promise<any>{
    
    let shuttleDoc = doc(this.firestore, "shuttles", shuttleId);
    console.log(shuttleDoc);
    
    return updateDoc(shuttleDoc, {
        plateNo: shuttle.plateNo,
        shuttleImage: shuttle.shuttleImage,
        routeName: shuttle.routeName,
        driver: shuttle.driver,
        pickupTime: shuttle.pickupTime,
        dropoffTime: shuttle.dropoffTime,
        route: shuttle.route
    })
  }

  async addImageToStorage(file: File){
    let date = Date.now();
    const filePath = `ShuttleImages/${date}`;
    const fileRef = this.storage.ref(filePath);

    await this.storage.upload(filePath, file);
    return filePath;
  }

  async getImageDownloadUrl(filePath: string){
    const fileRef = this.storage.ref(filePath);
    
    let downloadUrl = await fileRef.getDownloadURL();

    return downloadUrl;
    
  }

  async deleteShuttle(id: string){
    return deleteDoc(doc(this.firestore, "shuttles", id));
  }
}
