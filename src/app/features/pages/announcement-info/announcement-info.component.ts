import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Announcement } from 'src/app/core/models/announcement.model';
import { AnnouncementService } from 'src/app/core/services/announcement.service';

@Component({
  selector: 'app-announcement-info',
  templateUrl: './announcement-info.component.html',
  styleUrls: ['./announcement-info.component.sass']
})
export class AnnouncementInfoComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private announcementService: AnnouncementService,
    private spinner: NgxSpinnerService
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
    this.showInformation();
  }

  navigateToAnnouncement(){
    this.router.navigate(["announcements"]);
  }

  async showInformation(){
    let id = this.route.snapshot.paramMap.get('id') || "";
    // this.announcementService.getAnnouncementById(id).then((res)=>{
    //   let announcementDoc = res.docs.map((doc: any)=>{
    //     this.announcementForm.get("title")?.setValue(doc.data().title);
    //     this.announcementForm.get("content")?.setValue(doc.data().content);
    //   })
    // });
    (await this.announcementService.getAnnouncementById(id)).subscribe((value: any)=>{
        this.announcementForm.get("title")?.setValue(value[0].title);
        this.announcementForm.get("content")?.setValue(value[0].content);
    });
  }

  async editAnnouncement(){
    this.spinner.show();

    let id = this.route.snapshot.paramMap.get('id') || "";

    this.announcementModel.title = this.announcementForm.get("title")?.value;
    this.announcementModel.content = this.announcementForm.get("content")?.value;

    this.announcementService.updateAnnouncement(this.announcementModel, id).then(()=>{
      this.router.navigate(["announcements"]);
      new Toast("Announcement successfully updated!", {
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

    this.spinner.hide();
  }

}
