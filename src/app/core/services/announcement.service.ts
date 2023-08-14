import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Announcement } from '../models/announcement.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor(
    private firestore: Firestore,
    private http: HttpClient
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

  async sendPushNotifFCM(title: string, content: string){
    let data = {title: title, content: content};
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${API_URL}/send-notif`, data, { headers: headers })
    .subscribe(data => {
      console.log(data);
    });
  }
}
