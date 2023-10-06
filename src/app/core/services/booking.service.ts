import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

const API_URL = environment.api_url + "/bookings";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private firestore: Firestore,
    private http: HttpClient
  ) { }

  async getAllBookings(): Promise<any>{
    return await this.http.get<any>(`${API_URL}/get-bookings`);
  }
}
