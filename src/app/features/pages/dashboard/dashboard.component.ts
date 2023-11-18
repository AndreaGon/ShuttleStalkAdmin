import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BookingService } from 'src/app/core/services/booking.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['bookingNo', 'name', 'matriculation', 'date', 'time', 'routeName', 'pickupDropoff', 'isJourneyEnded', 'isAttendanceMarked'];
  dataSource?: any = new MatTableDataSource();

  listOfBookings: any[] = [];
  filterSelectObj: any[] = [];
  filterValues: any = {};

  bulkId: any[] = [];
  bulkEmail: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  fromDate: String = "";
  toDate: String = "";

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) { 

    this.filterSelectObj = [
      {
        name: 'Pickup/Dropoff',
        columnProp: 'pickupDropoff',
        options: []
      }, {
        name: 'Route name',
        columnProp: 'routeName',
        options: []
      }
    ]
  }

  ngOnInit(): void {
    this.refreshBookingTable();
    this.dataSource.filterPredicate = this.createFilter();
    this.changeDetector.detectChanges();
  }


  async refreshBookingTable(): Promise<void>{
    this.spinner.show();
    this.fromDate = "";
    this.toDate = "";
    this.listOfBookings = [];
    this.dataSource.filter = '';

    (await this.bookingService.getAllBookings()).subscribe((res: any)=>{
      res.forEach((doc: any, index: number) =>{
        this.listOfBookings.push(doc);
      })

      console.log(res);

      this.dataSource.data = this.listOfBookings;
      this.dataSource.paginator = this.paginator;

      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(this.listOfBookings, o.columnProp);
      });

      this.spinner.hide();
    })
  }

  exportToCSV(){
    var toExport: any = []
    this.dataSource.data.forEach((items: any, index: number)=>{
      toExport.push({
        "Booking no.": index + 1,
        "Booked by": items.studentName,
        "Matriculation": items.studentMatriculation,
        "Route name": items.routeName,
        "Booking date": items.date,
        "Booking time": items.time,
        "Pickup / Dropoff": items.pickupDropoff,
        "Is Journey Ended?": (items.is_invalid == "true") ? "YES" : "NO" ,
        "Is Attendance Marked?": (items.attendance_marked == "true") ? "YES" : "NO"
      })
    })
    this.bookingService.exportAsExcelFile(toExport, "Booking_Summary_" + Date.now().toString());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues["name"] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  getFilterObject(fullObj: any, key: any) {
    const uniqChk: any[] = [];
    fullObj.filter((obj: any) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

  // Called on Filter change
  filterChange(filter: any, event: any) {
    let filteredData = [];
    this.filterValues[filter.columnProp] = event.value.trim();

    if(filter.columnProp == "routeName"){
      filteredData = this.listOfBookings.filter((items)=>(items.routeName == this.filterValues["routeName"]))
    }
    else{
      filteredData = this.listOfBookings.filter((items)=>(items.pickupDropoff == this.filterValues["pickupDropoff"]))
    }
    
    this.dataSource.data =  filteredData;
  }

  // Custom filter method fot Angular Material Datatable
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }


      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            //console.log(data);
            searchTerms[col].trim().toLowerCase().split(' ').forEach((word: any) => {
              if (data[(col == "name") ? "studentName": col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                found = true
              }
            });
          }
          return found
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }

  onFromDateChange(event: any){
    this.fromDate = this.datePipe.transform(event.value, 'yyyy-MM-dd') || "";
  }

  onToDateChange(event: any){
    this.toDate = this.datePipe.transform(event.value, 'yyyy-MM-dd') || "";
  }

  filterByDate(){
    let filteredData = [];
    //this.listOfBookings = this.listOfBookings.filter((items)=>(items.date >= this.fromDate && items.date <= this.toDate))

    filteredData = this.listOfBookings.filter((items)=>(items.date >= this.fromDate && items.date <= this.toDate))

    this.dataSource.data = filteredData;
  }

  resetFilters() {
    this.filterValues = {}
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = undefined;
    })

    this.toDate = "";
    this.fromDate = "";
    this.dataSource.filter = "";

    this.refreshBookingTable();    
  }

}
