import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { Announcement } from 'src/app/core/models/announcement.model';
import { AnnouncementService } from 'src/app/core/services/announcement.service';

@Component({
  selector: 'app-new-announcement',
  templateUrl: './new-announcement.component.html',
  styleUrls: ['./new-announcement.component.sass']
})
export class NewAnnouncementComponent implements OnInit {

  constructor(
    private router: Router,
    private announcementService: AnnouncementService,
  ) { }

  announcementForm = new FormGroup({
    title: new FormControl(),
    content: new FormControl()
  });

  announcementModel: Announcement = {
    title: "",
    content: ""
  }

  ngOnInit(): void {
  }

  navigateToAnnouncement(){
    this.router.navigate(["announcements"]);
  }

  async createAnnouncement(){
    this.announcementModel.title = this.announcementForm.get("title")?.value;
    this.announcementModel.content = this.announcementForm.get("content")?.value;

    await this.announcementService.createAnnouncement(this.announcementModel).then((res)=>{
      new Toast("Announcement successfully created!", {
        position: 'top',
        theme: 'light'
      });
    }).catch((error)=>{
      new Toast("Error: " + error.message, {
        position: 'top',
        theme: 'light'
      });
    });
    
    this.router.navigate(["announcements"]);
  }

}
