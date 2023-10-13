import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Toast from 'awesome-toast-component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  email: string = "";
  password: string = "";

  ngOnInit(): void {
  }

  async signIn(){
    (await this.authService.checkExistingAdmin(this.email)).subscribe(async (value)=>{
      if(value.length != 0){
        await this.authService.signIn(this.email, this.password);
        this.email = "";
        this.password = "";
      }
      else{
        new Toast("Admin does not exist!", {
          position: 'top',
          theme: 'light'
        });
      }
    })
  }

}
