import { Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DriverService } from 'src/app/core/services/driver.service';
import { RouteService } from 'src/app/core/services/route.service';

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
    private routeService: RouteService,
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

  async deleteDriver(id: any, email: any){
    this.routeService.getRouteByDriverId(id).subscribe(async (res)=>{
      if(res.length > 0){
        new Toast("Error: Cannot delete driver as it is connected to a route. Please delete the route first!", {
          position: 'top',
          theme: 'light'
        });
      }
      else{
        (await this.driverService.deleteDriver(id, email)).subscribe(()=>{
          this.refreshTable();
          new Toast("Driver successfully deleted!", {
            position: 'top',
            theme: 'light'
          });
        })
      }
    });
    
  }

}
