import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Toast from 'awesome-toast-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Shuttle } from 'src/app/core/models/shuttle.model';
import { DriverService } from 'src/app/core/services/driver.service';
import { ShuttleService } from 'src/app/core/services/shuttle.service';

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
    private shuttleService: ShuttleService,
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

  setShuttleInformation(){
    this.spinner.show();
    let shuttleId = this.route.snapshot.paramMap.get("id") || "";

    if(shuttleId != ""){
      this.shuttleService.getShuttleOnQuery(shuttleId).then((res)=>{
        let shuttleDoc = res.docs.map((doc: any)=>{
          this.shuttleForm.get("plateNo")?.setValue(doc.data().plateNo);
          this.shuttleForm.get("routeName")?.setValue(doc.data().routeName);
          this.shuttleForm.get("pickupTime")?.setValue(doc.data().pickupTime);
          this.shuttleForm.get("dropoffTime")?.setValue(doc.data().dropoffTime);
          this.shuttleForm.get("driver")?.setValue(doc.data().driver);

          this.shuttleForm.get("seats")?.setValue(doc.data().seats);

          if(doc.data().shuttleImage != ""){
            this.imageName = doc.data().shuttleImage;
          }
          else{
            this.imageName = "No Image";
          }
          this.listOfAddresses = doc.data().route;
        })
      })
    }
    else{
      //TODO: 404 not found
    }

    this.spinner.hide();
  }

  async setDriversData(){
    this.listOfDrivers = [];
    (await this.driverService.getAllDriverAccounts()).forEach(doc => {
      this.listOfDrivers.push(doc.data());
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
        this.shuttleService.addImageToStorage(this.shuttleForm.get("shuttleImage")?.value).then((res)=>{
          this.newShuttle.shuttleImage = res;
  
          this.newShuttle.routeName = this.shuttleForm.get("routeName")?.value;
          this.newShuttle.plateNo = this.shuttleForm.get("plateNo")?.value;
          this.newShuttle.driver = this.shuttleForm.get("driver")?.value;
          this.newShuttle.pickupTime = this.shuttleForm.get("pickupTime")?.value;
          this.newShuttle.dropoffTime = this.shuttleForm.get("dropoffTime")?.value;
          this.newShuttle.route = this.shuttleForm.get("route")?.value;

          this.newShuttle.seats = this.shuttleForm.get("seats")?.value;
          
  
          this.shuttleService.updateShuttle(this.newShuttle, shuttleId).then(()=>{
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
        this.newShuttle.plateNo = this.shuttleForm.get("plateNo")?.value;
        this.newShuttle.driver = this.shuttleForm.get("driver")?.value;
        this.newShuttle.pickupTime = this.shuttleForm.get("pickupTime")?.value;
        this.newShuttle.dropoffTime = this.shuttleForm.get("dropoffTime")?.value;
        this.newShuttle.route = this.shuttleForm.get("route")?.value;

        this.newShuttle.seats = this.shuttleForm.get("seats")?.value;

        console.log(shuttleId);

        this.shuttleService.updateShuttle(this.newShuttle, shuttleId).then(()=>{
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
