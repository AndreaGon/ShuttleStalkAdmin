import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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

  signUp(){
    this.authService.signUp(this.email, this.password);
    this.email = "";
    this.password = "";
  }

  signIn(){
    this.authService.signIn(this.email, this.password);
    this.email = "";
    this.password = "";
  }

}
