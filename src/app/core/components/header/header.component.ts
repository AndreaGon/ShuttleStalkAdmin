import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  userRole: String = "";

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
  }

}
