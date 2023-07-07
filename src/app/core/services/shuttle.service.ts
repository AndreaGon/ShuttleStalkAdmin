import { Injectable } from '@angular/core';
import { Driver } from '../models/driver.model';

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Shuttle } from '../models/shuttle.model';


@Injectable({
  providedIn: 'root'
})
export class ShuttleService {

  constructor(
    private firestore: Firestore
  ) {}

  collection: any = collection(this.firestore, "shuttles");

  async addNewShuttle(shuttle: Shuttle): Promise<any>{
    let newShuttle: any = await addDoc(this.collection, {
        plateNo: shuttle.plateNo,
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
}
