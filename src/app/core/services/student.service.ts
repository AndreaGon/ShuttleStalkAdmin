import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Student } from '../models/student.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_URL = environment.api_url + "/students";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private firestore: Firestore,
    private http: HttpClient
  ) { }

  collection: any = collection(this.firestore, "students");  

  async getAllStudents(): Promise<any>{
      return await this.http.get<any>(`${API_URL}/get-students`);
  }

  async getStudentById(id: string): Promise<any>{
    return this.http.get<any>(`${API_URL}/get-student/${id}`);
  }

  async updateShuttle(student: Student, id: string): Promise<any>{
    let modifiedStudent = {
      is_banned: student.is_banned,
      num_of_no_show: student.num_of_no_show
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<any>( `${API_URL}/update-student/${id}`, modifiedStudent, { headers: headers }).subscribe((res)=>{
      console.log(res);
    });
  }

  async deleteStudent(id: string, email: string){
    await this.http.delete<any>(`${API_URL}/delete-student/${id}/${email}`).subscribe((value)=>{
      console.log(value);
    });
  }

  async deleteListOfStudents(ids: string[], email: string[]){
    ids.forEach(async (id, index)=>{
      await this.deleteStudent(id, email[index]);
    });
  }
}
