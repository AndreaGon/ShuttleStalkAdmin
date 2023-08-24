import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShuttleService } from 'src/app/core/services/shuttle.service';

@Component({
  selector: 'app-shuttle',
  templateUrl: './shuttle.component.html',
  styleUrls: ['./shuttle.component.sass']
})
export class ShuttleComponent implements OnInit {

  constructor(
    private router: Router,
    private shuttleService: ShuttleService,
    private spinner: NgxSpinnerService
  ) { }

  listOfShuttles: any[] = [];

  ngOnInit(): void {
    this.setRegisteredShuttles();
  }

  navigateToRegisterShuttles(){
    this.router.navigate(['register-shuttle']);
  }

  navigateToInfoPage(shuttle: any){
    this.router.navigate(['more-information', {id: shuttle.id}]);
  }

  async deleteShuttle(shuttle: any){
    await this.shuttleService.deleteShuttle(shuttle.id);
    this.setRegisteredShuttles();
  }

  async setRegisteredShuttles(){
    this.spinner.show();

    (await this.shuttleService.getAllShuttles()).subscribe((res: any[])=>{
      res.forEach((doc: any, index: number) => {
        if(doc.shuttleImage != ""){
          this.shuttleService.getImageDownloadUrl(doc.shuttleImage).then((observable)=>{
            observable.subscribe((url)=>{
              res[index].downloadUrl = url;
            })
          });
        }
        else{
          res[index].downloadUrl = "no image";
        }
        
        
      })

      this.listOfShuttles = res;
      this.spinner.hide();
    });
  }
}
