import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { Shuttle } from 'src/app/core/models/shuttle.model';
import { DriverService } from 'src/app/core/services/driver.service';
import { RouteService } from 'src/app/core/services/route.service';
import { ShuttleService } from 'src/app/core/services/shuttle.service';

@Component({
  selector: 'app-register-shuttle',
  templateUrl: './register-shuttle.component.html',
  styleUrls: ['./register-shuttle.component.sass']
})
export class RegisterShuttleComponent implements OnInit {


  constructor(
    private router: Router,
    private driverService: DriverService,
    private shuttleService: ShuttleService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  shuttleForm = new FormGroup({
    plateNo: new FormControl("",[Validators.required]),
    shuttleImage: new FormControl(),
    seats: new FormControl(),
  })

  newShuttle: Shuttle = {
    plateNo: "",
    shuttleImage: "",
    seats: 1
  };

  options = {
    componentRestrictions: {country: "my"}
   };

  ngOnInit(): void {
        
  }


  async registerShuttle(){
    //TODO: add data to firebase

    if(this.shuttleForm.valid){

      if(this.shuttleForm.get("shuttleImage")?.value != null){
        this.shuttleService.addImageToStorage(this.shuttleForm.get("shuttleImage")?.value).then(async (res)=>{
          this.newShuttle.shuttleImage = res;
          this.newShuttle.plateNo = this.shuttleForm.get("plateNo")?.value;
          this.newShuttle.seats = this.shuttleForm.get("seats")?.value;
  
          await this.shuttleService.addNewShuttle(this.newShuttle).then(()=>{
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

        await this.shuttleService.addNewShuttle(this.newShuttle).then(()=>{
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
      }
      
    }
    else{
      new Toast("Error: Please fill up all inputs", {
        position: 'top',
        theme: 'light'
      });
    }

    
  }

  cancelRegisterShuttle(){
    this.router.navigate(['shuttle']);
  }

}
