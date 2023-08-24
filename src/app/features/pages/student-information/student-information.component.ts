import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Student } from 'src/app/core/models/student.model';
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
  num_no_show: string = "";
  is_banned = new FormControl("");

  studentModel: Student = {
    is_banned: "",
    num_of_no_show: ""
  }

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
    (await this.studentService.getStudentById(id)).subscribe((res: any)=>{
        console.log(res);
        this.name = res.fullname;
        this.email = res.email;
        this.ic_number = res.ic_number;
        this.program = res.program;
        this.graduation_month = res.graduation_month;
        this.graduation_year = res.graduation_year;
        this.num_no_show = res.num_no_show;
        this.is_banned.setValue(res.is_banned)
    });
  }

  navigateToStudentPage(){
    this.router.navigate(["students"])
  }

  changeIsBanned(){
    let id = this.route.snapshot.paramMap.get('id') || "";

    this.studentModel.is_banned = this.is_banned.value;

    if(this.is_banned.value == "false"){
      this.studentModel.num_of_no_show = "0";
    }
    else{
      this.studentModel.num_of_no_show = "3";
    }
    this.studentService.updateShuttle(this.studentModel, id).then(()=>{
      new Toast("Ban option successfully changed!", {
        position: 'top',
        theme: 'light'
      });

      this.router.navigate(["students"])
    }).catch((error)=>{
      new Toast("Error: " + error.message, {
        position: 'top',
        theme: 'light'
      });
    });
  }

}
