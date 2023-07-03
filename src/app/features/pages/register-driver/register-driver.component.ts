import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Account } from 'src/app/core/models/account.model';
import { AccountService } from 'src/app/core/services/account.service';
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
    private accountService: AccountService,
    private driverService: DriverService,
    private router: Router
  ) { }

  driverForm = new FormGroup({
    fullname: new FormControl(),
    icNumber: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  })

  account: Account = {
    fullname: "",
    icNumber: "",
    email: "",
    role: ""
  }

  ngOnInit(): void {
  }

  registerDriver(){
    this.account.fullname = this.driverForm.get("fullname")?.value;
    this.account.icNumber = this.driverForm.get("icNumber")?.value;
    this.account.email = this.driverForm.get("email")?.value;
    this.account.role = "DRIVER";

    //Register driver
    this.driverService.signUpDriver(this.driverForm.get("email")?.value, this.driverForm.get("password")?.value).then((value: any) =>{

      if(value){
        this.accountService.addNewAccount(this.account).then((res)=>{
          new Toast("Driver successfully added!", {
            position: 'top',
            theme: 'light'
          });

          this.router.navigate(["drivers"]);
        });
      }
      
    })
  
  }

  cancelRegister(){
    this.router.navigate(["drivers"]);
  }

}
