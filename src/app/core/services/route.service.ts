import { Injectable } from '@angular/core';

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Route } from '../models/route.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = environment.api_url + "/routes";

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(
    private firestore: Firestore,
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {}


  getAllRoutes(){
    return this.http.get<any>(`${API_URL}/get-routes`);
  }

  async getRouteOnQuery(id: string): Promise<any>{
    return this.http.get<any>(`${API_URL}/get-route/${id}`);
  }

  getRouteByShuttleId(id: string){
    return this.http.get<any>(`${API_URL}/get-route-by-shuttle/${id}`);
  }

  getRouteByDriverId(id: string){
    return this.http.get<any>(`${API_URL}/get-route-by-driver/${id}`);
  }

  async addNewRoute(route: Route): Promise<any>{
    let newShuttle: any = {
      routeName: route.routeName,
      driverId: route.driver,
      shuttleId: route.shuttle,
      pickupTime: route.pickupTime,
      dropoffTime: route.dropoffTime,
      route: route.route,
      routeImage: route.routeImage
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${API_URL}/add-route`, newShuttle, { headers: headers })
  }

  async updateRoute(route: Route, id: string): Promise<any>{
    let modifiedRoute: any = {
      routeName: route.routeName,
      driverId: route.driver,
      shuttleId: route.shuttle,
      pickupTime: route.pickupTime,
      dropoffTime: route.dropoffTime,
      route: route.route,
      routeImage: route.routeImage
    };

    console.log(modifiedRoute);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<any>( `${API_URL}/update-route/${id}`, modifiedRoute, { headers: headers }).subscribe((res)=>{
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
    await this.http.post<any>(`${API_URL}/upload-route-image`, formData).subscribe(()=>{});

    return imageName + fileExtension;
  }

  async getImageDownloadUrl(filePath: string){
    const fileRef = this.storage.ref(`RouteImages/${filePath}`);
    
    let downloadUrl = await fileRef.getDownloadURL();

    return downloadUrl;
    //return this.http.get(`${API_URL}/get-shuttle-image/${filePath}`);
  }

  async deleteRoute(id: string){
    return this.http.delete(`${API_URL}/delete-route/${id}`).subscribe((value)=>{
      console.log(value);
    });
  }
}
