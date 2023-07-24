import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.sass']
})
export class StudentsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'email', 'icnumber', 'program', 'graduation_month', 'graduation_year', 'action'];
  dataSource?: any;

  listOfStudents: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.refreshStudentTable();
    this.changeDetector.detectChanges();
  }

  async refreshStudentTable(): Promise<void>{
    this.spinner.show();
    this.listOfStudents = [];

    (await this.studentService.getAllStudents().then((res)=>{
      res.forEach((doc: any, index: number) =>{
        this.listOfStudents.push(doc);
      })
    }))

    this.dataSource = new MatTableDataSource(this.listOfStudents);
    this.dataSource.paginator = this.paginator;

    this.spinner.hide();
  }

  deleteStudent(id: any){

  }

}
