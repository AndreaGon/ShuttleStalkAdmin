import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { Shuttle } from 'src/app/core/models/shuttle.model';
import { DriverService } from 'src/app/core/services/driver.service';
import { ShuttleService } from 'src/app/core/services/shuttle.service';

@Component({
  selector: 'app-register-shuttle',
  templateUrl: './register-shuttle.component.html',
  styleUrls: ['./register-shuttle.component.sass']
})
export class RegisterShuttleComponent implements OnInit {
  title: string = 'AGM project';
  latitude!: number;
  longitude!: number;
  zoom!:number;
  private geoCoder: any;

  listOfAddresses: any[] = [];
  listOfDrivers!: any[]; 

  address: any = {};

  @ViewChild('searchAddress') searchElementRef!: ElementRef;

  constructor(
    private router: Router,
    private driverService: DriverService,
    private shuttleService: ShuttleService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  shuttleForm = new FormGroup({
    plateNo: new FormControl("",[Validators.required]),
    driver: new FormControl("",[Validators.required]),
    routeName: new FormControl("",[Validators.required]),
    shuttleImage: new FormControl(),
    seats: new FormControl(),
    pickupTime: new FormControl([],[Validators.required]),
    dropoffTime: new FormControl([],[Validators.required]),
    route: new FormControl([],[Validators.required])
  })

  newShuttle: Shuttle = {
    plateNo: "",
    routeName: "",
    shuttleImage: "",
    driver: [""],
    seats: 1,
    pickupTime: [],
    dropoffTime: [],
    route: [""]
  };

  options = {
    componentRestrictions: {country: "my"}
   };

  ngOnInit(): void {
    this.setDriversData();

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, this.options);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(()=>{
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if(place.geometry == undefined || place.geometry == null) {
            return;
          }

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          console.log(this.longitude, this.latitude);
          this.zoom = 12;

          this.address.display = place.name;
          this.address.value = {latitude: this.latitude, longitude: this.longitude};
          console.log(this.listOfAddresses)
        })
      })
    })
    
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
        console.log(this.latitude, this.longitude);
      });
    }
  }

  async setDriversData(){
    this.listOfDrivers = [];
    // (await this.driverService.getAllDriverAccounts()).forEach(doc => {
    //   this.listOfDrivers.push(doc.data());
    // });

    (this.driverService.getAllDriverAccounts()).subscribe((data)=>{
      this.listOfDrivers = data;
    });  
  }

  addAddress(){
    this.listOfAddresses.push(this.address);  
    this.address = {}  
  }

  async registerShuttle(){
    //TODO: add data to firebase
    this.shuttleForm.get("route")?.setValue(this.listOfAddresses);

    if(this.shuttleForm.valid){

      if(this.shuttleForm.get("shuttleImage")?.value != null){
        this.shuttleService.addImageToStorage(this.shuttleForm.get("shuttleImage")?.value).then(async (res)=>{
          this.newShuttle.shuttleImage = res;
  
          this.newShuttle.routeName = this.shuttleForm.get("routeName")?.value;
          this.newShuttle.plateNo = this.shuttleForm.get("plateNo")?.value;
          this.newShuttle.driver = this.shuttleForm.get("driver")?.value;
          this.newShuttle.pickupTime = this.shuttleForm.get("pickupTime")?.value;
          this.newShuttle.dropoffTime = this.shuttleForm.get("dropoffTime")?.value;
          this.newShuttle.route = this.shuttleForm.get("route")?.value;

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
        this.newShuttle.routeName = this.shuttleForm.get("routeName")?.value;
        this.newShuttle.plateNo = this.shuttleForm.get("plateNo")?.value;
        this.newShuttle.driver = this.shuttleForm.get("driver")?.value;
        this.newShuttle.pickupTime = this.shuttleForm.get("pickupTime")?.value;
        this.newShuttle.dropoffTime = this.shuttleForm.get("dropoffTime")?.value;
        this.newShuttle.route = this.shuttleForm.get("route")?.value;

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
