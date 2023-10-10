import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Admin } from '../models/admin.model';

const API_URL = environment.api_url + "/admins";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) { }

  getAllAdmins(){
    return this.http.get<any[]>(`${API_URL}/get-admins`);
  }

  getAdminByEmail(email: any){
    return this.http.get<any[]>(`${API_URL}/get-admin/${email}`);
  }

  async signUpAdmin(account: Admin){
    let newAccount = {
      fullname: account.fullname,
      role: account.role,
      email: account.email, 
      password: account.password
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log("SIGN UP");
    await this.http.post<any>(`${API_URL}/register-admin`, newAccount, { headers: headers }).subscribe((res)=>{
      console.log(res);
    });
  }

  async deleteAdmin(id: string, email: string){
    await this.http.delete<any>(`${API_URL}/delete-admin/${id}/${email}`).subscribe((value)=>{
      console.log(value);
    });
  }
}
