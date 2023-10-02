import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { Admin } from 'src/app/core/models/admin.model';
import { Driver } from 'src/app/core/models/driver.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriverService } from 'src/app/core/services/driver.service';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.sass']
})
export class RegisterAdminComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authService: AuthService
  ) { }

  adminForm = new FormGroup({
    fullname: new FormControl("", Validators.required),
    role: new FormControl("", Validators.required),
    email: new FormControl("",[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl("", Validators.required)
  })

  account: Admin = {
    fullname: "",
    email: "",
    role: "",
    password: ""
  }

  ngOnInit(): void {
  }

  async registerAdmin(){
    this.account.fullname = this.adminForm.get("fullname")?.value;
    this.account.email = this.adminForm.get("email")?.value;
    this.account.role = this.adminForm.get("role")?.value;
    this.account.password = this.adminForm.get("password")?.value;

    if(
      this.adminForm.valid
    ){
      (await this.authService.checkExistingAdmin(this.account.email)).subscribe((res)=>{
        console.log(res)
        if(res.length == 0){
            //Register driver
            this.adminService.signUpAdmin(this.account).then((res)=>{
              new Toast("Admin successfully added!", {
                  position: 'top',
                  theme: 'light'
              });
              console.log(res)
              this.router.navigate(["admins"]);
            })
            .catch((error)=>{
              new Toast("Error: " + error.message, {
                position: 'top',
                theme: 'light'
              });
            });
            
        }
        else{
          new Toast("Error: Admin already exists!" , {
            position: 'top',
            theme: 'light'
          });
        }
      }); 
    }

    else{
      new Toast("Error: Please fill up all the driver information" , {
        position: 'top',
        theme: 'light'
      });
    }
  }

  cancelRegister(){
    this.router.navigate(["admins"]);
  }

}
