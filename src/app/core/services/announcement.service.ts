import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Announcement } from '../models/announcement.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

const API_URL = environment.api_url + "/announcements";

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
    return this.http.get<any>(`${API_URL}/get-announcements`);
  }

  async getAnnouncementById(id: string): Promise<any>{
    return this.http.get<any>(`${API_URL}/get-announcement/${id}`);
  }

  async updateAnnouncement(announcement: Announcement, id: string): Promise<any>{
    
    // let announcementDoc = doc(this.firestore, "announcements", id);
    // console.log(announcementDoc);
    
    // return updateDoc(announcementDoc, {
    //     title: announcement.title,
    //     content: announcement.content
    // })

    let modifiedAnnouncement = {
      title: announcement.title,
      content: announcement.content
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<any>( `${API_URL}/update-announcement/${id}`, modifiedAnnouncement, { headers: headers }).subscribe((res)=>{
      console.log(res);
    });
  }

  async createAnnouncement(announcement: Announcement){
    let newAnnouncement = {
      title: announcement.title,
      content: announcement.content,
      timestamp: Date.now()
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    await this.http.post<any>(`${API_URL}/new-announcement`, newAnnouncement, { headers: headers }).subscribe((res)=>{
      console.log(res);
    });
  }

  async deleteShuttle(id: string){
    return this.http.delete(`${API_URL}/delete-announcement/${id}`).subscribe((value)=>{
      console.log(value);
    });
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
