import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RouteService } from 'src/app/core/services/route.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.sass']
})
export class RouteComponent implements OnInit {

  constructor(
    private router: Router,
    private routeService: RouteService,
    private spinner: NgxSpinnerService
  ) { }

  listOfRoutes: any[] = [];

  ngOnInit(): void {
    this.setRegisteredRoutes();
  }

  navigateToRegisterRoutes(){
    this.router.navigate(['register-route']);
  }

  navigateToInfoPage(shuttle: any){
    this.router.navigate(['route-information', {id: shuttle.id}]);
  }

  async deleteRoute(shuttle: any){
    await this.routeService.deleteRoute(shuttle.id);
    this.setRegisteredRoutes();
  }

  async setRegisteredRoutes(){
    this.spinner.show();

    (this.routeService.getAllRoutes()).subscribe((res: any[])=>{
      res.forEach((doc: any, index: number) => {
        if(doc.routeImage != ""){
          this.routeService.getImageDownloadUrl(doc.routeImage).then((observable)=>{
            observable.subscribe((url)=>{
              res[index].downloadUrl = url;
            })
          });
        }
        else{
          res[index].downloadUrl = "no image";
        }      
        
      })

      this.listOfRoutes = res;
      this.spinner.hide();
    });
  }

}
