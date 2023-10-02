import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/core/services/admin.service';
import { DriverService } from 'src/app/core/services/driver.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.sass']
})
export class AdminsComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'role', 'email', 'action'];
  dataSource?: any;

  adminData: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(){
    this.refreshTable();
    this.changeDetector.detectChanges();
  }

  navigateToRegisterAdmin(){
    this.router.navigate(['register-admin']);
  }

  async refreshTable(): Promise<void>{
    this.spinner.show();
    this.adminData = [];
    (this.adminService.getAllAdmins()).subscribe((data)=>{
      this.adminData = data;
      this.dataSource = new MatTableDataSource(this.adminData);
      this.dataSource.paginator = this.paginator;
      console.log(this.adminData);
      this.spinner.hide();
    });    
  }

  deleteAdmin(id: any, email: any){
    this.adminService.deleteAdmin(id, email).then((res)=>{
      new Toast("Admin successfully deleted!", {
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
