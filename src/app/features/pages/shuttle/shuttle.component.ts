import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { RouteService } from 'src/app/core/services/route.service';
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
    private routeService: RouteService,
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
    this.router.navigate(['shuttle-information', {id: shuttle.id}]);
  }

  async deleteShuttle(shuttle: any){
    this.routeService.getRouteByShuttleId(shuttle.id).subscribe(async (res)=>{
      if(res.length > 0){
        new Toast("Error: Cannot delete shuttle as it is connected to a route. Please delete the route first!", {
          position: 'top',
          theme: 'light'
        });
      }
      else{
        (await this.shuttleService.deleteShuttle(shuttle.id)).subscribe(()=>{
          this.setRegisteredShuttles();
        });
      }
    })
    
    
  }

  async setRegisteredShuttles(){
    this.spinner.show();

    (this.shuttleService.getAllShuttles()).subscribe((res: any[])=>{
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
      console.log(res);
      this.listOfShuttles = res;
      this.spinner.hide();
    });
  }
}
