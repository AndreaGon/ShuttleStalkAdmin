import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     fileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
