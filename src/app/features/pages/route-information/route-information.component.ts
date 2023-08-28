import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Route } from 'src/app/core/models/route.model';
import { DriverService } from 'src/app/core/services/driver.service';
import { RouteService } from 'src/app/core/services/route.service';
import { ShuttleService } from 'src/app/core/services/shuttle.service';

@Component({
  selector: 'app-route-information',
  templateUrl: './route-information.component.html',
  styleUrls: ['./route-information.component.sass']
})
export class RouteInformationComponent implements OnInit {
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
    private route: ActivatedRoute,
    private driverService: DriverService,
    private routeService: RouteService,
    private shuttleService: ShuttleService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService
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

   imageName: string = "";

  ngOnInit(): void {
    this.setDriversData();
    this.setShuttlesData();
    this.setShuttleInformation();

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

  async setShuttleInformation(){
    this.spinner.show();
    let shuttleId = this.route.snapshot.paramMap.get("id") || "";

    if(shuttleId != ""){
      (await this.routeService.getRouteOnQuery(shuttleId)).subscribe((res: any)=>{
        this.routeForm.get("routeName")?.setValue(res.routeName);
        this.routeForm.get("pickupTime")?.setValue(res.pickupTime);
        this.routeForm.get("dropoffTime")?.setValue(res.dropoffTime);
        this.routeForm.get("driver")?.setValue(res.driverId);

        this.routeForm.get("shuttle")?.setValue(res.shuttleId);

        if(res.shuttleImage != ""){
          this.imageName = res.shuttleImage;
        }
        else{
          this.imageName = "No Image";
        }
        this.listOfAddresses = res.route;
      })
    }
    else{
      //TODO: 404 not found
    }

    this.spinner.hide();
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

  editShuttle(){
    //TODO: add data to firebase
    this.routeForm.get("route")?.setValue(this.listOfAddresses);

    if(this.routeForm.valid){

      let shuttleId = this.route.snapshot.paramMap.get("id") || "";

      if(this.routeForm.get("routeImage")?.value != null){
        this.routeService.addImageToStorage(this.routeForm.get("routeImage")?.value).then((res)=>{
  
          this.newRoute.routeName = this.routeForm.get("routeName")?.value;
          this.newRoute.driver = this.routeForm.get("driver")?.value;
          this.newRoute.pickupTime = this.routeForm.get("pickupTime")?.value;
          this.newRoute.dropoffTime = this.routeForm.get("dropoffTime")?.value;
          this.newRoute.route = this.routeForm.get("route")?.value;

          
  
          this.routeService.updateRoute(this.newRoute, shuttleId).then(()=>{
            this.router.navigate(["route"]);
            new Toast("Shuttle successfully updated!", {
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


        this.routeService.updateRoute(this.newRoute, shuttleId).then(()=>{
          this.router.navigate(["route"]);
          new Toast("Route successfully edited!", {
            position: 'top',
            theme: 'light'
          });
        })
        .catch((error)=>{
          console.log(error)
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

  cancelEditShuttle(){
    this.router.navigate(['route']);
  }

}
