import { Component, OnInit, ViewChild, DoCheck, AfterViewInit, Output, EventEmitter, OnDestroy, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { icon, latLng, marker, polyline, tileLayer } from 'leaflet';
import { forkJoin, interval, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { __deviceHistory } from '../../myclass';
import { XAxisService } from '../../services/x-axis.service';
import { WidgetComponent } from '../../components/widget/widget.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare let $: any;
declare let L: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, DoCheck, OnDestroy {

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
  @Output() _widgetData = new EventEmitter();
  @Input() widgetIndex: any;
  public height: any;
  public width: any;
  chartWidth: number = 0;
  chartHeight: number = 0;
  toEditRequest: any;
  @ViewChild('newmap') newmap!: any;
  constructor(public dialog: MatDialog, public service: XAxisService, public dataService: AuthService, private ref: ChangeDetectorRef) { }
  ngDoCheck(): void {

    const status = this.dataService.getAccess();
    if (status) {
      this.watchSize();
    }

  }
  watchSize() {
    const id = this.widgetIndex.toString();
    let that = this;
    let x = document.getElementById(id);
    // console.log(x)
    $(x).resizable({
      stop: function (event: Event, ui: any) {
        // console.log(ui)
        let height: number = $(ui.size.height)[0];
        let width: number = $(ui.size.width)[0];
        let top: number = $(ui.position.top)[0];
        let left: number = $(ui.position.left)[0];
        const newSize: any = {
          width: width, height: height, top: top,
          left: left
        }

        that.chartWidth = width;
        that.chartHeight = height;

        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);

        // sending/emitting data to parent-dashboard.ts for saving into api
        that._widgetData.emit(that.WIDGET_REQUEST)
      }
    });
    $(x).draggable({
      stop: function (event: Event, ui: any) {
        console.log(ui)
        let top: number = $(ui.position.top)[0];
        let left: number = $(ui.position.left)[0];
        const orgSize = JSON.parse(that.WIDGET_REQUEST.WIDGET_SIZE);
        const newSize = {
          width: orgSize.width,
          height: orgSize.height,
          top: top, left: left
        }
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);

        // sending/emitting data to parent-dashboard.ts for saving into api
        that._widgetData.emit(that.WIDGET_REQUEST)
      }
    })

  }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.WIDGET_REQUEST) {
      this.WIDGET_REQUEST.WIDGET_DATA = this.WIDGET_REQUEST.WIDGET_DATA.toUpperCase();
      console.log('map req:', this.WIDGET_REQUEST)
      //  
      this.getLocationsByConfigID();

    }
  }
  ngAfterViewInit(): void {
    console.log('map initMap:')
    this.initMap()
  }
  initMap() {
    if (this.myMap) {
      this.myMap.remove();
    }
    var mapOptions = {
      center: [17.385044, 78.486671],
      zoom: 4
    }
    // const =
    this.myMap = new L.map(this.newmap.nativeElement, mapOptions);
    var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.myMap.addLayer(layer);

  }
  getLocationsByConfigID() {
    this.dataService.getAllLocationsByConfigID(this.WIDGET_REQUEST).subscribe(res => {
      // console.log('map loc', res)
      if (res && res.data) {
        this.cityLocations = res.data.map((city: any) => {
          city.isSelected = false;
          city.LOCATION = city.LOCATION.toUpperCase()
          return city;
        });
        this.getAllDevice();
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

      if (res && res.data) {

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
          else if (this.WIDGET_REQUEST.WIDGET_TYPE == 'MAPS' && !this.WIDGET_REQUEST.STATIC_COORDS) {
            // DYNAMIC COORDS MAPPING
            console.log('DYNAMIC COORDS', this.WIDGET_REQUEST.STATIC_COORDS)
            const intervalTime = interval(3000);
            this.setInterval = intervalTime.subscribe(() => {
              this.getCurrDeviceByLabel(res);
            })
          } else if (this.WIDGET_REQUEST.WIDGET_TYPE == 'MAPS' && this.WIDGET_REQUEST.STATIC_COORDS) {
            // STATIC COORDS 
            //  console.log(res.data)
            console.log('STATIC COORDS', this.WIDGET_REQUEST.STATIC_COORDS)

            this.markerArr = res.data.map((rest: any) => {
              return {
                latitude: rest.LATITUDE,
                longitude: rest.LONGITUDE,
                ignitionStatus: 'ON',
                deviceId: rest.MAC_ADDRESS
              }
            })


            let mIndex = 0;
            for (let m of this.markerArr) {
              var deviceIcon = L.icon({
                iconUrl: 'assets/map-widget.png',
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
                this.myMap.setZoom(6);

              }
              mIndex++;

            }
            this.ref.detectChanges();
          }

        }

      }

    })
  }



  getCurrDeviceByLabel(res: any) {

    // collect location -active only
    const resultArr = res.data.filter((item: any) => {
      return item.MAC_STATUS === 1;
    })
    // console.log(resultArr)
    forkJoin(resultArr.map((result: any) => this.dataService.getLiveLocationByCity(result))).subscribe((response: any) => {
      // console.log(response)
      this.markerArr = response;
      if (response && response.length > 0) {
        this.defaultLat = response[0].latitude;
        this.defaultLng = response[0].longitude;
        const newArr: any[] = response.map((resp: any) => {
          return {

            ASSET_CONFIG_ID: this.WIDGET_REQUEST.ASSET_CONFIG_ID,
            DEVICE_ID: resp.deviceId,
            VALUE: JSON.stringify({ "speed": resp.speed, "odometer": resp.odometer, "battery": resp.battery }),
            STATUS: resp.ignitionStatus,
            LATITUDE: resp.latitude,
            LONGITUDE: resp.longitude,
            LOCATION: resp.region
          }
        })
        // 

        // forkJoin(newArr.map((result: any) => this.dataService.saveDeviceHistory(result))).subscribe((response: any) => {

        // })


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

      this.ref.detectChanges();
    })


  }

  ngOnDestroy(): void {
    this.setInterval?.unsubscribe();
    if (this.myMap) {
      this.myMap.remove();
    }
  }

  saveWidget() {

    this._widgetData.emit(this.WIDGET_REQUEST)
  }

  async editRequest(req: any) {

    this.toEditRequest = req;
    this.openDialog();
  }


  openDialog() {
    const dialogRef = this.dialog.open(WidgetComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: this.toEditRequest ? this.toEditRequest : null
    });
    dialogRef.afterClosed().subscribe(result => {
      // call all charts      
    });
  }
  removeRequest(item: any) {
    console.log(item)
    this.dataService.deleteChartRequests(item).subscribe(res => {
      this.ngOnInit();

    })
  }
}
