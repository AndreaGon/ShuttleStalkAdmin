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

  downloadUrl: any;

  collection: any = collection(this.firestore, "shuttles");

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

  async addImageToStorage(file: File){
    let date = Date.now();
    const filePath = `ShuttleImages/${date}`;
    const fileRef = this.storage.ref(filePath);

    await this.storage.upload(filePath, file);
    return filePath;
  }
}
