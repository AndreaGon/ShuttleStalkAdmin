import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { Route } from 'src/app/core/models/route.model';
import { DriverService } from 'src/app/core/services/driver.service';
import { RouteService } from 'src/app/core/services/route.service';
import { ShuttleService } from 'src/app/core/services/shuttle.service';

@Component({
  selector: 'app-register-route',
  templateUrl: './register-route.component.html',
  styleUrls: ['./register-route.component.sass']
})
export class RegisterRouteComponent implements OnInit {
  latitude!: number;
  longitude!: number;
  zoom!:number;
  private geoCoder: any;

  listOfAddresses: any[] = [];
  listOfDrivers!: any[]; 
  listOfShuttles!: any[]; 

  address: any = {};

  @ViewChild('searchAddress') searchElementRef!: ElementRef;

  constructor(
    private router: Router,
    private driverService: DriverService,
    private routeService: RouteService,
    private shuttleService: ShuttleService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  routeForm = new FormGroup({
    shuttle: new FormControl("",[Validators.required]),
    driver: new FormControl("",[Validators.required]),
    routeName: new FormControl("",[Validators.required]),
    pickupTime: new FormControl([],[Validators.required]),
    dropoffTime: new FormControl([],[Validators.required]),
    route: new FormControl([],[Validators.required]),
    routeImage: new FormControl(),
  })

  newRoute: Route = {
    routeName: "",
    driver: [""],
    shuttle: [""],
    pickupTime: [],
    dropoffTime: [],
    route: [""],
    routeImage: ""
  };

  options = {
    componentRestrictions: {country: "my"}
   };

  ngOnInit(): void {
    this.setDriversData();
    this.setShuttlesData();

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

  async setShuttlesData(){
    this.listOfShuttles = [];
    (await this.shuttleService.getAllShuttles()).subscribe((data: any)=>{
      this.listOfShuttles = data;
    });  
  }

  async setDriversData(){
    this.listOfDrivers = [];
    (this.driverService.getAllDriverAccounts()).subscribe((data)=>{
      this.listOfDrivers = data;
    });  
  }

  addAddress(){
    this.listOfAddresses.push(this.address);  
    this.address = {}  
  }

  async registerRoute(){
    //TODO: add data to firebase
    this.routeForm.get("route")?.setValue(this.listOfAddresses);

    if(this.routeForm.valid){

      if(this.routeForm.get("routeImage")?.value != null){
        this.routeService.addImageToStorage(this.routeForm.get("routeImage")?.value).then(async (res)=>{
          console.log(res);
          this.newRoute.routeImage = res;
          this.newRoute.routeName = this.routeForm.get("routeName")?.value;
          this.newRoute.driver = this.routeForm.get("driver")?.value;
          this.newRoute.pickupTime = this.routeForm.get("pickupTime")?.value;
          this.newRoute.dropoffTime = this.routeForm.get("dropoffTime")?.value;
          this.newRoute.route = this.routeForm.get("route")?.value;
          this.newRoute.shuttle = this.routeForm.get("shuttle")?.value;
  
          await this.routeService.addNewRoute(this.newRoute).then(()=>{
            this.router.navigate(["route"]);
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
        this.newRoute.routeName = this.routeForm.get("routeName")?.value;
        this.newRoute.driver = this.routeForm.get("driver")?.value;
        this.newRoute.pickupTime = this.routeForm.get("pickupTime")?.value;
        this.newRoute.dropoffTime = this.routeForm.get("dropoffTime")?.value;
        this.newRoute.route = this.routeForm.get("route")?.value;
        this.newRoute.shuttle = this.routeForm.get("shuttle")?.value;

        await this.routeService.addNewRoute(this.newRoute).then(()=>{
          this.router.navigate(["route"]);
          new Toast("Route successfully added!", {
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

  cancelRegisterRoute(){
    this.router.navigate(['route']);
  }

}
