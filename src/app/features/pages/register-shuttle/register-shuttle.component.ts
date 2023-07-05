import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverService } from 'src/app/core/services/driver.service';

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
  address: any;
  private geoCoder: any;

  listOfDrivers!: any[]; 

  @ViewChild('searchAddress') searchElementRef!: ElementRef;

  constructor(
    private router: Router,
    private driverService: DriverService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  shuttleForm = new FormGroup({
    plateNo: new FormControl(),
    routeName: new FormControl(),
    pickupTime: new FormControl(),
    dropoffTime: new FormControl(),
  })

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

          this.address = place.name;


          if(place.geometry == undefined || place.geometry == null) {
            return;
          }

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          console.log(this.longitude, this.latitude);
          this.zoom = 12;
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
    (await this.driverService.getAllDriverAccounts()).forEach(doc => {
      this.listOfDrivers.push(doc.data());
    });

    console.log(this.listOfDrivers);
  }

  markerDragEnd($event: any) {    
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    console.log(this.longitude, this.latitude);

    //this.getAddress(this.latitude, this.longitude);
  }

  addAddress(){
    //TODO: add address to ngx chip
    
  }

  registerShuttle(){
    //TODO: add data to firebase
    console.log(this.shuttleForm);
  }

  cancelRegisterShuttle(){
    this.router.navigate(['shuttle']);
  }

}
