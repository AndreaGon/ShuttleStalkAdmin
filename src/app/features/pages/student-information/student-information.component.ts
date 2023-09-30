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
  no_show: number = 0;
  is_banned = new FormControl("");

  studentModel: Student = {
    is_banned: "",
    no_show: 0
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
        this.no_show = res.no_show;
        
        if(this.no_show >= 3){
          this.is_banned.setValue("true");
        }
        else{
          this.is_banned.setValue("false");
        }
    });
  }

  navigateToStudentPage(){
    this.router.navigate(["students"])
  }

  changeIsBanned(){
    let id = this.route.snapshot.paramMap.get('id') || "";

    if(this.is_banned.value == "false"){
      this.studentModel.no_show = 0;
    }
    else{
      this.studentModel.no_show = 3;
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
