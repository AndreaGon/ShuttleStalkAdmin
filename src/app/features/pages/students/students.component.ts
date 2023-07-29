import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.sass']
})
export class StudentsComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'email', 'icnumber', 'program', 'graduation_month', 'graduation_year', 'is_banned', 'action'];
  dataSource?: any = new MatTableDataSource();

  listOfStudents: any[] = [];
  filterSelectObj: any[] = [];
  filterValues: any = {};

  bulkData: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) { 

    this.filterSelectObj = [
      {
        name: 'Program',
        columnProp: 'program',
        options: []
      }, {
        name: 'Graduation Month',
        columnProp: 'graduation_month',
        options: []
      }, {
        name: 'Graduation Year',
        columnProp: 'graduation_year',
        options: []
      }
    ]
  }

  ngOnInit(): void {
    this.refreshStudentTable();
    this.dataSource.filterPredicate = this.createFilter();
    this.changeDetector.detectChanges();
  }

  checkUncheckAll(event: any){
    this.dataSource.data.forEach((data: any) => {
      data.is_selected = event.checked
      
      if(event.checked){
        this.bulkData.push(data.id);
      }
      else{
        this.bulkData = [];
      }
    })

    console.log(this.bulkData)
  }

  selectData(event: any, id: string){
    if(event.checked){
      this.bulkData.push(id);
    }
    else{
      this.bulkData.splice(this.bulkData.indexOf(id), 1);
    }
  }

  deleteBatch(){
    this.studentService.deleteListOfStudents(this.bulkData).then(()=>{
      new Toast("Successfully deleted students!", {
        position: 'top',
        theme: 'light'
      });

      this.refreshStudentTable();
    }).catch((error)=>{
      new Toast("Error: " + error.message, {
        position: 'top',
        theme: 'light'
      });
    });
  }

  async refreshStudentTable(): Promise<void>{
    this.spinner.show();
    this.listOfStudents = [];

    (await this.studentService.getAllStudents().then((res)=>{
      res.forEach((doc: any, index: number) =>{
        doc.is_selected = false;
        this.listOfStudents.push(doc);
      })
    }))

    this.dataSource.data = this.listOfStudents;
    this.dataSource.paginator = this.paginator;

    this.filterSelectObj.filter((o) => {
      o.options = this.getFilterObject(this.listOfStudents, o.columnProp);
    });

    this.spinner.hide();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues["name"] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  async deleteStudent(id: any){
    await this.studentService.deleteStudent(id).then((res)=>{
      new Toast("Student successfully deleted!", {
        position: 'top',
        theme: 'light'
    });
    })
    .catch((error)=>{
      new Toast("Error: " + error.message, {
        position: 'top',
        theme: 'light'
      });
    });
    this.refreshStudentTable();
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
