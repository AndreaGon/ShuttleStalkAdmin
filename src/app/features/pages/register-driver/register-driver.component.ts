import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    fullname: new FormControl(),
    icNumber: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
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
    this.account.role = "DRIVER";

    await this.driverService.checkExistingDriver(this.account.email).then(async (res)=>{
      if(res.size == 0){
          //Register driver
          await this.driverService.signUpDriver(this.account).then((res)=>{
            new Toast("Driver successfully added!", {
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
          
          this.router.navigate(["drivers"]);
        }
        else{
          new Toast("Error: Driver already exists!" , {
            position: 'top',
            theme: 'light'
          });
        }
    }); 
  }

  cancelRegister(){
    this.router.navigate(["drivers"]);
  }

}
