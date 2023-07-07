import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShuttleService } from 'src/app/core/services/shuttle.service';

@Component({
  selector: 'app-shuttle',
  templateUrl: './shuttle.component.html',
  styleUrls: ['./shuttle.component.sass']
})
export class ShuttleComponent implements OnInit {

  constructor(
    private router: Router,
    private shuttleService: ShuttleService
  ) { }

  listOfShuttles: any[] = [];

  ngOnInit(): void {
    this.shuttleService.getAllShuttles().then((res)=>{
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
      console.log(this.listOfShuttles)
    });
  }

  navigateToRegisterShuttles(){
    this.router.navigate(['register-shuttle']);
  }

}
