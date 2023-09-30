import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { Announcement } from 'src/app/core/models/announcement.model';
import { AnnouncementService } from 'src/app/core/services/announcement.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-new-announcement',
  templateUrl: './new-announcement.component.html',
  styleUrls: ['./new-announcement.component.sass']
})
export class NewAnnouncementComponent implements OnInit {

  constructor(
    private router: Router,
    private announcementService: AnnouncementService,
    private authService: AuthService
  ) { }

  announcementForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required)
  });

  announcementModel: Announcement = {
    title: "",
    content: "",
    createdBy: ''
  }

  ngOnInit(): void {
  }

  navigateToAnnouncement(){
    this.router.navigate(["announcements"]);
  }

  async createAnnouncement(){
    
    this.announcementModel.title = this.announcementForm.get("title")?.value;
    this.announcementModel.content = this.announcementForm.get("content")?.value;
    this.announcementModel.createdBy = this.authService.getEmail().email;

    if(
      this.announcementForm.valid
    ){
      await this.announcementService.createAnnouncement(this.announcementModel).then(async (res)=>{
        new Toast("Announcement successfully created!", {
          position: 'top',
          theme: 'light'
        });
  
        await this.announcementService.sendPushNotifFCM(this.announcementModel.title, this.announcementModel.content).then(()=>{
          this.navigateToAnnouncement();
        });
         
      }).catch((error)=>{
        new Toast("Error: " + error.message, {
          position: 'top',
          theme: 'light'
        });
      });
    }
    else{
      new Toast("Error: Please fill up the title and announcement content", {
        position: 'top',
        theme: 'light'
      });
    }
    
  }

}
