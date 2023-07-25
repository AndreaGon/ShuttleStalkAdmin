import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

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

  async deleteStudent(id: string){
    return deleteDoc(doc(this.firestore, "students", id));
  }
}
