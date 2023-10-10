import { Injectable } from '@angular/core';

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Shuttle } from '../models/shuttle.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = environment.api_url + "/shuttles";

@Injectable({
  providedIn: 'root'
})
export class ShuttleService {

  constructor(
    private firestore: Firestore,
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {}

  collection: any = collection(this.firestore, "shuttles");

  async getAllShuttles(): Promise<any>{
    return this.http.get<any>(`${API_URL}/get-shuttles`);
  }

  async getShuttleOnQuery(id: string): Promise<any>{
    return this.http.get<any>(`${API_URL}/get-shuttle/${id}`);
  }

  async addNewShuttle(shuttle: Shuttle): Promise<any>{
    let newShuttle: any = {
      plateNo: shuttle.plateNo,
      shuttleImage: shuttle.shuttleImage,
      seats: shuttle.seats
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    await this.http.post<any>(`${API_URL}/add-shuttle`, newShuttle, { headers: headers }).subscribe((res)=>{
      console.log(res);
    });
  }

  async updateShuttle(shuttle: Shuttle, id: string): Promise<any>{
    console.log(shuttle.shuttleImage);
    let modifiedShuttle: any = {
      plateNo: shuttle.plateNo,
      shuttleImage: shuttle.shuttleImage,
      seats: shuttle.seats
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<any>( `${API_URL}/update-shuttle/${id}`, modifiedShuttle, { headers: headers }).subscribe((res)=>{
      console.log(res);
    });
  }

  async addImageToStorage(image: File){
    let formData = new FormData();
    let date = Date.now();
    const fileExtension = "." + image.type.split("/")[1];
    const imageName = `${date}`;
    formData.append("image", image, imageName);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    await this.http.post<any>(`${API_URL}/upload-shuttle-image`, formData).subscribe(()=>{});

    return imageName + fileExtension;
  }

  async getImageDownloadUrl(filePath: string){
    const fileRef = this.storage.ref(`ShuttleImages/${filePath}`);
    
    let downloadUrl = await fileRef.getDownloadURL();

    return downloadUrl;
    //return this.http.get(`${API_URL}/get-shuttle-image/${filePath}`);
  }

  async deleteShuttle(id: string){
    return this.http.delete(`${API_URL}/delete-shuttle/${id}`);
  }
}
