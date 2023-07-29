import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private firestore: Firestore
  ) { }

  collection: any = collection(this.firestore, "students");  

  async getAllStudents(): Promise<any>{
    const querySnapshot = await getDocs(this.collection);

    let documents: any[] = [];
    querySnapshot.forEach((doc)=>{
      documents.push(doc.data());
    });

    return documents;
  }

  async getStudentById(id: string): Promise<any>{
    const q = query(this.collection, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    return await querySnapshot;
  }

  async updateShuttle(student: Student, id: string): Promise<any>{
    
    let studentDoc = doc(this.firestore, "students", id);
    
    return updateDoc(studentDoc, {
        is_banned: student.is_banned,
        num_no_show: student.num_no_show
    })
  }

  async deleteStudent(id: string){
    return deleteDoc(doc(this.firestore, "students", id));
  }

  async deleteListOfStudents(ids: string[]){
    ids.forEach((id)=>{
      deleteDoc(doc(this.firestore, "students", id));
    })
  }
}
