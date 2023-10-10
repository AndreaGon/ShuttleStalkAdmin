import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnnouncementService } from 'src/app/core/services/announcement.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.sass']
})
export class AnnouncementsComponent implements OnInit {

  displayedColumns: string[] = ['position', 'title', 'action'];
  dataSource?: any;

  announcements: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private router: Router,
    private announcementService: AnnouncementService,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.refreshTable();
  }

  navigateToNewAnnouncement(){
    this.router.navigate(["new-announcement"])
  }

  async refreshTable(){
    this.spinner.show();
    this.announcements = [];

    (await this.announcementService.getAllAnnouncements()).subscribe((data: any[])=>{
      this.announcements = data.filter(item => item.createdBy == this.authService.getUser().email);
      this.dataSource = new MatTableDataSource(this.announcements);
      this.dataSource.paginator = this.paginator;
      
      this.spinner.hide();
    })
  }

  async deleteAnnouncement(id: any){
    (await this.announcementService.deleteShuttle(id)).subscribe((res)=>{
      new Toast("Announcement successfully deleted!", {
        position: 'top',
        theme: 'light'
      });
      this.refreshTable();  
    });
  }

}
