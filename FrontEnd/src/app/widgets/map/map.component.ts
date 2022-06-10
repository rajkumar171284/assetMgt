import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { icon, latLng, marker, polyline, tileLayer } from 'leaflet';
import { forkJoin, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';

declare let L: any;
// var deviceIcon = L.icon({
//   iconUrl: 'assets/vts.png',
//   shadowUrl: 'assets/ignition-off.png',

//   iconSize: [38, 55], // size of the icon
//   shadowSize:   [32, 34], // size of the shadow
//   iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//   shadowAnchor: [4, 107],  // the same for the shadow
//   popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
// });
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  // wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
  //   detectRetina: true,
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // });

  // Marker for the top of Mt. Ranier
  // summit = marker([46.8523, -121.7603], {
  //   icon: icon({
  //     iconSize: [25, 31],
  //     iconAnchor: [13, 21],
  //     iconUrl: 'leaflet/marker-icon.png',
  //     shadowUrl: 'leaflet/marker-shadow.png'
  //   })
  // });

  // Marker for the parking lot at the base of Mt. Ranier trails
  // paradise = marker([46.78465227596462, -81.74141269177198], {
  //   icon: icon({
  //     iconSize: [25, 41],
  //     iconAnchor: [13, 41],
  //     iconUrl: 'leaflet/marker-icon.png',
  //     iconRetinaUrl: 'leaflet/marker-icon-2x.png',
  //     shadowUrl: 'leaflet/marker-shadow.png'
  //   })
  // });

  // Path from paradise to summit - most points omitted from this example for brevity
  // route = polyline([[46.78465227596462, -121.74141269177198],
  // [46.80047278292477, -121.73470708541572],
  // [46.815471360459924, -121.72521826811135],
  // [46.8360239546746, -121.7323131300509],
  // [46.844306448474526, -121.73327445052564],
  // [46.84979408048093, -121.74325201660395],
  // [46.853193528950214, -121.74823296256363],
  // [46.85322881676257, -121.74843915738165],
  // [46.85119913890958, -121.7519719619304],
  // [46.85103829018772, -121.7542376741767],
  // [46.85101557523012, -121.75431755371392],
  // [46.85140013694763, -121.75727385096252],
  // [46.8525277543813, -121.75995212048292],
  // [46.85290292836726, -121.76049157977104],
  // [46.8528160918504, -121.76042997278273]]);

  // Layers control object with our two base layers and the three overlay layers
  // layersControl = {
  //   baseLayers: {
  //     'Street Maps': this.streetMaps,
  //     'Wikimedia Maps': this.wMaps
  //   },
  //   overlays: {
  //     'Mt. Rainier Summit': this.summit,
  //     'Mt. Rainier Paradise Start': this.paradise,
  //     'Mt. Rainier Climb Route': this.route
  //   }
  // };


  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  // options = {
  //   layers: [this.streetMaps, this.route, this.summit, this.paradise],
  //   zoom: 7,
  //   center: latLng([46.879966, -121.726909])
  // };
  @Input() WIDGET_REQUEST: any;
  labelMessage: any;
  labelMessage2: any;
  deviceType: string = '';
  markerArr: any = [];
  myMap: any;
  defaultLat: any = 11.505;
  defaultLng: any = -0.09;
  constructor(private dataService: AuthService, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
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

  getAllDevice() {
    this.dataService.getMACByConfigID({ PID: this.WIDGET_REQUEST.ASSET_CONFIG_ID }).subscribe(res => {
      console.log('highlights', res)
      this.ref.checkNoChanges();
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
          else if (this.WIDGET_REQUEST.WIDGET_TYPE == 'MAPS') {

            const intervalTime = interval(3000);
            intervalTime.subscribe(()=>{
              this.getCurrDeviceByLabel(res)
            })

            // this.getCurrDeviceByLabel(res);


          }

        }

      }

    })
  }



  getCurrDeviceByLabel(res: any) {
    console.log('this.WIDGET_REQUEST-charts-count', this.WIDGET_REQUEST)

    // collect location -active only
    const resultArr = res.data.filter((item: any) => {
      return item.MAC_STATUS === 1;
    })
    forkJoin(resultArr.map((result: any) => this.dataService.getLiveLocationByCity(result))).subscribe((response: any) => {
      // console.log(response)
      this.markerArr = response;
      if (response && response.length > 0) {
        this.defaultLat = response[0].latitude;
        this.defaultLng = response[0].longitude;
        //  let view=L.setView([this.defaultLat, this.defaultLng], 5).addTo(this.myMap);

      }
      console.log('markerArr', this.markerArr)
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
          this.myMap.panTo(new L.LatLng(this.markerArr[mIndex].latitude, this.markerArr[mIndex].longitude));
          this.myMap.setZoom(16);
        mIndex++;

      }
      // L.marker([51.5, -0.09], { icon: deviceIcon }).addTo(this.myMap).bindPopup("I am a green leaf.");
      // L.marker([51.495, -0.083], { icon: deviceIcon }).addTo(this.myMap).bindPopup("I am a red leaf.");
      // L.marker([51.49, -0.1], { icon: deviceIcon }).addTo(this.myMap).bindPopup("I am an orange leaf.");
    })


  }

}
