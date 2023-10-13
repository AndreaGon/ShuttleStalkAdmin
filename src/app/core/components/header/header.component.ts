import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  userRole: String = "admin";

  constructor(
    private authService: AuthService
  ) {

    this.authService.loggedIn$.subscribe((value)=>{
      if(value){
        this.userRole = this.authService.getRole();
      }
    })
   }

  ngOnInit(): void {
        
  }

}
