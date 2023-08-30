import { MapsAPILoader } from '@agm/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Shuttle } from 'src/app/core/models/shuttle.model';
import { DriverService } from 'src/app/core/services/driver.service';
import { RouteService } from 'src/app/core/services/route.service';
import { ShuttleService } from 'src/app/core/services/shuttle.service';

@Component({
  selector: 'app-shuttle-information',
  templateUrl: './shuttle-information.component.html',
  styleUrls: ['./shuttle-information.component.sass']
})
export class ShuttleInformationComponent implements OnInit {

  imageName: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private driverService: DriverService,
    private routeService: RouteService,
    private shuttleService: ShuttleService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService
  ) { }

  shuttleForm = new FormGroup({
    plateNo: new FormControl("",[Validators.required]),
    shuttleImage: new FormControl(),
    seats: new FormControl("", Validators.required),
  });

  newShuttle: Shuttle = {
    plateNo: "",
    shuttleImage: "",
    seats: 1
  };

  ngOnInit(): void {
    this.setShuttleInformation();
  }

  async setShuttleInformation(){
    this.spinner.show();
    let shuttleId = this.route.snapshot.paramMap.get("id") || "";

    if(shuttleId != ""){
      (await this.shuttleService.getShuttleOnQuery(shuttleId)).subscribe((res: any)=>{
        this.shuttleForm.get("plateNo")?.setValue(res.plateNo);
        this.shuttleForm.get("shuttleImage")?.setValue(res.shuttleImage);
        this.shuttleForm.get("seats")?.setValue(res.seats);

        if(res.shuttleImage != ""){
          this.imageName = res.shuttleImage;
        }
        else{
          this.imageName = "No Image";
        }
      })
    }
    else{
      //TODO: 404 not found
    }

    this.spinner.hide();
  }

  cancelEditShuttle(){
    this.router.navigate(['shuttle']);
  }

  async editShuttle(){
    if(this.shuttleForm.valid){

      let shuttleId = this.route.snapshot.paramMap.get("id") || "";

      console.log(this.shuttleForm.get("shuttleImage")?.value)

      if(
        this.shuttleForm.get("seats")?.value >= 1 &&
        this.shuttleForm.get("seats")?.value <= 50
      ){
        if(this.shuttleForm.get("shuttleImage")?.value != ""){
          this.shuttleService.addImageToStorage(this.shuttleForm.get("shuttleImage")?.value).then(async (res)=>{
            this.newShuttle.shuttleImage = res;
            this.newShuttle.plateNo = this.shuttleForm.get("plateNo")?.value;
            this.newShuttle.seats = this.shuttleForm.get("seats")?.value;
    
            await this.shuttleService.updateShuttle(this.newShuttle, shuttleId).then(()=>{
              this.router.navigate(["shuttle"]);
              new Toast("Shuttle successfully added!", {
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
          });
        }
        else{
          this.newShuttle.plateNo = this.shuttleForm.get("plateNo")?.value;
          this.newShuttle.seats = this.shuttleForm.get("seats")?.value;
  
          await this.shuttleService.updateShuttle(this.newShuttle, shuttleId).then(()=>{
            this.router.navigate(["shuttle"]);
            new Toast("Shuttle successfully edited!", {
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
        }
      }
      else{
        new Toast("Error: seating must be between 1 to 50 only!", {
          position: 'top',
          theme: 'light'
        });
      }
      
    }
    else{
      new Toast("Error: Please fill up all inputs", {
        position: 'top',
        theme: 'light'
      });
    }
  }

  validateFile(){
    let file = this.shuttleForm.get("shuttleImage")?.value;

    if(
      file.type != "image/jpeg" &&
      file.type != "image/png" &&
      file.type != "image/jpg"
    ){
      this.shuttleForm.get("shuttleImage")?.setValue("");
      new Toast("Error: Please insert a JPG or PNG image file", {
        position: 'top',
        theme: 'light'
      });
    }
  }

}
