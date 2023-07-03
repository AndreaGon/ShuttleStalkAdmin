import { Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Account } from 'src/app/core/models/account.model';
import { AccountService } from 'src/app/core/services/account.service';
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
    private accountService: AccountService,
    private driverService: DriverService,
    private changeDetector: ChangeDetectorRef
    ) { }

  ngOnInit(){
    this.refreshTable();
    this.changeDetector.detectChanges();
  }

  navigateToRegisterDrivers(){
    this.router.navigate(['register-driver']);
  }

  async refreshTable(): Promise<void>{
    (await this.accountService.getAllDriverAccounts()).forEach(doc => {
      this.driverAccounts.push(doc.data());
    });
    this.dataSource = new MatTableDataSource(this.driverAccounts);
    this.dataSource.paginator = this.paginator;
  }

  deleteDriver(id: any, accountId: any){
    return this.driverService.deleteDriver(id, accountId);
  }

}
