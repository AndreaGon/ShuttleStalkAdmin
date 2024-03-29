import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

  @ViewChild('pickupPicker') pickupPicker: any;
  @ViewChild('dropoffPicker') dropoffPicker: any;

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
    this.setRouteInformation();

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

  async setRouteInformation(){
    this.spinner.show();
    let routeId = this.route.snapshot.paramMap.get("id") || "";

    if(routeId != ""){
      (await this.routeService.getRouteOnQuery(routeId)).subscribe((res: any)=>{
        this.routeForm.get("routeName")?.setValue(res.routeName);
        this.routeForm.get("pickupTime")?.setValue(res.pickupTime);
        this.routeForm.get("dropoffTime")?.setValue(res.dropoffTime);
        this.routeForm.get("driver")?.setValue(res.driverId);
        this.routeForm.get("routeImage")?.setValue(res.routeImage);

        this.routeForm.get("shuttle")?.setValue(res.shuttleId);

        if(res.routeImage != ""){
          this.imageName = res.routeImage;
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

  editRoute(){
    //TODO: add data to firebase
    this.routeForm.get("route")?.setValue(this.listOfAddresses);

    console.log(this.routeForm.get("shuttleImage")?.value)

    if(this.routeForm.valid){

      let routeId = this.route.snapshot.paramMap.get("id") || "";

      console.log(this.newRoute.routeImage);

      if(this.routeForm.get("routeImage")?.value instanceof File){
        this.routeService.addImageToStorage(this.routeForm.get("routeImage")?.value).then((res)=>{
          this.newRoute.routeImage = res;
          this.newRoute.routeName = this.routeForm.get("routeName")?.value;
          this.newRoute.driver = this.routeForm.get("driver")?.value;
          this.newRoute.pickupTime = this.routeForm.get("pickupTime")?.value;
          this.newRoute.dropoffTime = this.routeForm.get("dropoffTime")?.value;
          this.newRoute.route = this.routeForm.get("route")?.value;
          this.newRoute.shuttle = this.routeForm.get("shuttle")?.value;

          
          console.log(this.newRoute);
          this.routeService.updateRoute(this.newRoute, routeId).then(()=>{
            this.router.navigate(["route"]);
            new Toast("Route successfully updated!", {
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

        this.newRoute.routeImage = this.routeForm.get("routeImage")?.value;

        console.log(this.newRoute.routeImage);

        this.routeService.updateRoute(this.newRoute, routeId).then(()=>{
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

  cancelEditRoute(){
    this.router.navigate(['route']);
  }

  onSelectPickupPicker(){
    this.pickupPicker.open();
  }

  onSelectDropoffPicker(){
    this.dropoffPicker.open();
  }

  updatePickupTime(event: any){
    const currentItemsArray = this.routeForm.get('pickupTime')?.value;
    const newItemsArray = [...currentItemsArray, event];

    this.routeForm.get('pickupTime')?.setValue(newItemsArray);
  }

  updateDropoffTime(event: any){
    const currentItemsArray = this.routeForm.get('dropoffTime')?.value;
    const newItemsArray = [...currentItemsArray, event];

    this.routeForm.get('dropoffTime')?.setValue(newItemsArray);
  }

  timePickerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      const isValid = timePattern.test(control.value);
  
      return isValid ? null : { timeFormat: true };
    };
  }

}
