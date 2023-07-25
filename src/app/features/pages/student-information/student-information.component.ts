import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.sass']
})
export class StudentInformationComponent implements OnInit {

  name: string = "";
  email: string = "";
  ic_number: string = "";
  program: string = "";
  graduation_month: string = "";
  graduation_year: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.showInformation();
  }

  async showInformation(){
    let id = this.route.snapshot.paramMap.get('id') || "";
    this.studentService.getStudentById(id).then((res)=>{
      let studentDoc = res.docs.map((doc: any)=>{
        this.name = doc.data().name;
        this.email = doc.data().email;
        this.ic_number = doc.data().ic_number;
        this.program = doc.data().program;
        this.graduation_month = doc.data().graduation_month;
        this.graduation_year = doc.data().graduation_year;
      })
    });
  }

}
