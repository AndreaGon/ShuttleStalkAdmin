import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Johnathan', weight: 1.0079},
  {position: 2, name: 'Neil', weight: 4.0026},
];

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.sass']
})
export class DriverComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'action'];
  dataSource = ELEMENT_DATA;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToRegisterDrivers(){
    this.router.navigate(['register-driver']);
  }

}
