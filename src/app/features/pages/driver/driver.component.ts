import { Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DriverService } from 'src/app/core/services/driver.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.sass']
})
export class DriverComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'icnumber', 'email', 'action'];
  dataSource?: any;

  driverAccounts: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private router: Router,
    private driverService: DriverService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(){
    this.refreshTable();
    this.changeDetector.detectChanges();
  }

  navigateToRegisterDrivers(){
    this.router.navigate(['register-driver']);
  }

  async refreshTable(): Promise<void>{
    this.spinner.show();
    this.driverAccounts = [];
    (this.driverService.getAllDriverAccounts()).subscribe((data)=>{
      this.driverAccounts = data;
      this.dataSource = new MatTableDataSource(this.driverAccounts);
      this.dataSource.paginator = this.paginator;

      this.spinner.hide();
    });    
  }

  async deleteDriver(id: any){
    await this.driverService.deleteDriver(id).then((res)=>{
      new Toast("Driver successfully deleted!", {
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
    this.refreshTable();
  }

}
