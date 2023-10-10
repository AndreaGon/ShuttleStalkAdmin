import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  email: string = "";

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.email = this.authService.getUser()!.email;
  }

  signOut(){
    this.authService.signOut();
  }
}
