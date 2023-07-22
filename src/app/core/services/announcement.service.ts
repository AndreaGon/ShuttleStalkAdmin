import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Announcement } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor(
    private firestore: Firestore
  ) { }

  collection: any = collection(this.firestore, "announcements");

  async getAllAnnouncements(): Promise<any>{
    const querySnapshot = await getDocs(this.collection);
    return await querySnapshot;
  }

  async getAnnouncementById(id: string): Promise<any>{
    const q = query(this.collection, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    return await querySnapshot;
  }

  async updateAnnouncement(announcement: Announcement, id: string): Promise<any>{
    
    let announcementDoc = doc(this.firestore, "announcements", id);
    console.log(announcementDoc);
    
    return updateDoc(announcementDoc, {
        title: announcement.title,
        content: announcement.content
    })
  }

  async createAnnouncement(announcement: Announcement): Promise<any>{
    let newAnnouncement: any = await addDoc(this.collection, {
      title: announcement.title,
      content: announcement.content,
      timestamp: Date.now()
    });

    return updateDoc(newAnnouncement, {
      id: newAnnouncement.id
    })
  }

  async deleteShuttle(id: string){
    return deleteDoc(doc(this.firestore, "announcements", id));
  }
}
