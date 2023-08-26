import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Driver } from 'src/app/core/models/driver.model';
import { DriverService } from 'src/app/core/services/driver.service';
import Toast from 'awesome-toast-component'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.component.html',
  styleUrls: ['./register-driver.component.sass']
})
export class RegisterDriverComponent implements OnInit {

  constructor(
    private driverService: DriverService,
    private router: Router
  ) { }

  driverForm = new FormGroup({
    fullname: new FormControl("", Validators.required),
    icNumber: new FormControl("", Validators.required),
    email: new FormControl("",[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl("", Validators.required)
  })

  account: Driver = {
    fullname: "",
    icNumber: "",
    email: "",
    role: "",
    password: ""
  }

  ngOnInit(): void {
  }

  async registerDriver(){
    this.account.fullname = this.driverForm.get("fullname")?.value;
    this.account.icNumber = this.driverForm.get("icNumber")?.value;
    this.account.email = this.driverForm.get("email")?.value;
    this.account.password = this.driverForm.get("password")?.value;

    if(
      this.driverForm.valid
    ){
      (await this.driverService.checkExistingDriver(this.account.email)).subscribe((res)=>{
        console.log(res)
        if(res.length == 0){
            //Register driver
            this.driverService.signUpDriver(this.account).then((res)=>{
              new Toast("Driver successfully added!", {
                  position: 'top',
                  theme: 'light'
              });
              console.log(res)
              this.router.navigate(["drivers"]);
            })
            .catch((error)=>{
              new Toast("Error: " + error.message, {
                position: 'top',
                theme: 'light'
              });
            });
            
        }
        else{
          new Toast("Error: Driver already exists!" , {
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
    this.router.navigate(["drivers"]);
  }

}
