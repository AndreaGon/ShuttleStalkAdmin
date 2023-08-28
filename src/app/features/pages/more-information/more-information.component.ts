import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Route } from 'src/app/core/models/route.model';
import { DriverService } from 'src/app/core/services/driver.service';
import { RouteService } from 'src/app/core/services/route.service';

@Component({
  selector: 'app-more-information',
  templateUrl: './more-information.component.html',
  styleUrls: ['./more-information.component.sass']
})
export class MoreInformationComponent implements OnInit {
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
    private route: ActivatedRoute,
    private driverService: DriverService,
    private routeService: RouteService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService
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

  newShuttle: Route = {
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
        this.shuttleForm.get("plateNo")?.setValue(res.plateNo);
          this.shuttleForm.get("routeName")?.setValue(res.routeName);
          this.shuttleForm.get("pickupTime")?.setValue(res.pickupTime);
          this.shuttleForm.get("dropoffTime")?.setValue(res.dropoffTime);
          this.shuttleForm.get("driver")?.setValue(res.driver);

          this.shuttleForm.get("seats")?.setValue(res.seats);

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
    this.shuttleForm.get("route")?.setValue(this.listOfAddresses);

    if(this.shuttleForm.valid){

      let shuttleId = this.route.snapshot.paramMap.get("id") || "";

      if(this.shuttleForm.get("shuttleImage")?.value != null){
        this.routeService.addImageToStorage(this.shuttleForm.get("shuttleImage")?.value).then((res)=>{
  
          this.newShuttle.routeName = this.shuttleForm.get("routeName")?.value;
          this.newShuttle.driver = this.shuttleForm.get("driver")?.value;
          this.newShuttle.pickupTime = this.shuttleForm.get("pickupTime")?.value;
          this.newShuttle.dropoffTime = this.shuttleForm.get("dropoffTime")?.value;
          this.newShuttle.route = this.shuttleForm.get("route")?.value;

          
  
          this.routeService.updateRoute(this.newShuttle, shuttleId).then(()=>{
            this.router.navigate(["shuttle"]);
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
        this.newShuttle.routeName = this.shuttleForm.get("routeName")?.value;
        this.newShuttle.driver = this.shuttleForm.get("driver")?.value;
        this.newShuttle.pickupTime = this.shuttleForm.get("pickupTime")?.value;
        this.newShuttle.dropoffTime = this.shuttleForm.get("dropoffTime")?.value;
        this.newShuttle.route = this.shuttleForm.get("route")?.value;

        console.log(shuttleId);

        this.routeService.updateRoute(this.newShuttle, shuttleId).then(()=>{
          this.router.navigate(["shuttle"]);
          new Toast("Shuttle successfully added!", {
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
    this.router.navigate(['shuttle']);
  }

}
