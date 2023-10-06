import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
  styleUrls: ['./dashboard.component.sass']
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

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) { 

    this.filterSelectObj = [
      {
        name: 'Pickup/Dropoff',
        columnProp: 'pickupDropoff',
        options: []
      }, {
        name: 'Route Name',
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
    this.listOfBookings = [];

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
    //let filterValues = {}
    this.filterValues[filter.columnProp] = event.value.trim();
    this.dataSource.filter = JSON.stringify(this.filterValues);
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

      console.log(searchTerms);

      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col].trim().toLowerCase().split(' ').forEach((word: any) => {
              if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
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

  resetFilters() {
    this.filterValues = {}
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = undefined;
    })
    this.dataSource.filter = "";
  }

}