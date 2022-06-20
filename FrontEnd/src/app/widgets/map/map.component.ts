import { Component, OnInit, AfterViewInit, OnDestroy, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { icon, latLng, marker, polyline, tileLayer } from 'leaflet';
import { forkJoin, interval, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { __deviceHistory } from '../../myclass';
declare let $: any;

declare let L: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  @Input() WIDGET_REQUEST: any;
  labelMessage: any;
  labelMessage2: any;
  deviceType: string = '';
  markerArr: any = [];
  myMap: any;
  defaultLat: any = 11.505;
  defaultLng: any = -0.09;
  cityLocations: any = [];
  isCitySelected = false;
  setInterval: Subscription | undefined;
  constructor(private dataService: AuthService, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    $(".resizable").resizable();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.WIDGET_REQUEST) {
      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      console.log('map req:', this.WIDGET_REQUEST)

      this.getAllDevice();
    }
  }
  ngAfterViewInit(): void {
    var mapOptions = {
      center: [17.385044, 78.486671],
      zoom: 4
    }
    this.myMap = new L.map('map', mapOptions);
    var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.myMap.addLayer(layer);
    // this.myMap = L.map('map').setView([this.defaultLat, this.defaultLng], 5);
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 8,
    //   attribution: '© OpenStreetMap'
    // }).addTo(this.myMap);
  }
  getLocationsByConfigID() {
    this.dataService.getAllLocationsByConfigID({ PID: this.WIDGET_REQUEST.ASSET_CONFIG_ID }).subscribe(res => {
      console.log('map loc', res)
      if (res && res.data) {
        this.cityLocations = res.data.map((city: any) => {
          city.isSelected = false;
          city.LOCATION = city.LOCATION.toUpperCase()
          return city;
        });
        this.ref.detectChanges();
        // console.log(this.cityLocations)
      }
    })

  }
  showByCity(a: any) {
    if (a) {

      for (let item of this.cityLocations) {
        item.isSelected = false;
      };
      const index = this.cityLocations.findIndex((item: any) => {
        return item.LOCATION == a.LOCATION;
      })
      if (index != -1) {
        this.cityLocations[index].isSelected = true;
      }
      this.isCitySelected = true;
      const city = this.markerArr.filter((item: any) => {
        return item.region.toUpperCase() == a.LOCATION;
      })
      this.myMap.panTo(new L.LatLng(city[0].latitude, city[0].longitude));
      this.myMap.setZoom(16);
    }

  }
  getAllDevice() {
    this.dataService.getMACByConfigID({ PID: this.WIDGET_REQUEST.ASSET_CONFIG_ID }).subscribe(res => {
      console.log('map', res)
      // this.ref.detectChanges();
      if (res && res.data) {
        this.getLocationsByConfigID();

        this.WIDGET_REQUEST.MAC_COUNT = res.data.length;
        if (res.data.length > 0) {

          this.deviceType = res.data[0].MAC_NAME;

          if (this.WIDGET_REQUEST.WIDGET_TYPE != 'CHARTS' && this.WIDGET_REQUEST.WIDGET_DATA == "COUNT") {
            this.labelMessage = `Total Count`;


          } else if (this.WIDGET_REQUEST.WIDGET_DATA == "STATUS") {
            this.labelMessage = `Active`;
            this.labelMessage2 = `In-Active`;
            const active = res.data.filter((a: any) => {
              return a.MAC_STATUS === 1
            })
            this.WIDGET_REQUEST.activeCount = active.length > 0 ? active.length : 0;
            const inactive = res.data.filter((a: any) => {
              return a.MAC_STATUS === 0
            })
            this.WIDGET_REQUEST.inactiveCount = inactive.length > 0 ? inactive.length : 0;

          }
          else if (this.WIDGET_REQUEST.WIDGET_TYPE == 'MAPS') {

            const intervalTime = interval(60000);
            this.setInterval = intervalTime.subscribe(() => {
              this.getCurrDeviceByLabel(res);
            })
            // this.getCurrDeviceByLabel(res);

          }

        }

      }

    })
  }



  getCurrDeviceByLabel(res: any) {
    // console.log('this.WIDGET_REQUEST-charts-count', this.WIDGET_REQUEST)

    // collect location -active only
    const resultArr = res.data.filter((item: any) => {
      return item.MAC_STATUS === 1;
    })
    forkJoin(resultArr.map((result: any) => this.dataService.getLiveLocationByCity(result))).subscribe((response: any) => {
      console.log(response)
      this.markerArr = response;
      if (response && response.length > 0) {
        this.defaultLat = response[0].latitude;
        this.defaultLng = response[0].longitude;
        const newArr: __deviceHistory[] = response.map((resp: any) => {
          return {

            ASSET_CONFIG_ID: this.WIDGET_REQUEST.ASSET_CONFIG_ID,
            DEVICE_ID: resp.deviceId,
            VALUE: JSON.stringify({"speed":resp.speed,"odometer":resp.odometer,"battery":resp.battery}),
            STATUS: resp.ignitionStatus,
            LATITUDE: resp.latitude,
            LONGITUDE: resp.longitude,
            LOCATION: resp.region
  }
        })
        // 

        forkJoin(newArr.map((result: any) => this.dataService.saveDeviceHistory(result))).subscribe((response: any) => {

        })      


      }
      // console.log('markerArr', this.markerArr)
      let mIndex = 0;
      for (let m of this.markerArr) {
        var deviceIcon = L.icon({
          iconUrl: 'assets/vts.png',
          shadowUrl: this.markerArr[mIndex].ignitionStatus == 'OFF' ? 'assets/ignition-off.png' : '',

          iconSize: [38, 55], // size of the icon
          shadowSize: [32, 34], // size of the shadow
          iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 107],  // the same for the shadow
          popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        let marker = L.marker([this.markerArr[mIndex].latitude, this.markerArr[mIndex].longitude], { icon: deviceIcon })
          .bindPopup(this.markerArr[mIndex].deviceId).addTo(this.myMap);
        // set latest lat,lng once initialy
        if (!this.isCitySelected) {
          this.myMap.panTo(new L.LatLng(this.markerArr[mIndex].latitude, this.markerArr[mIndex].longitude));
          this.myMap.setZoom(16);

        }
        mIndex++;

      }
      // L.marker([51.5, -0.09], { icon: deviceIcon }).addTo(this.myMap).bindPopup("I am a green leaf.");
      // L.marker([51.495, -0.083], { icon: deviceIcon }).addTo(this.myMap).bindPopup("I am a red leaf.");
      // L.marker([51.49, -0.1], { icon: deviceIcon }).addTo(this.myMap).bindPopup("I am an orange leaf.");
    })


  }

  ngOnDestroy(): void {
    this.setInterval?.unsubscribe();
  }

}
