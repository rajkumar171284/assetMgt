import { Component, Inject, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { _deviceType } from '../../../myclass';

@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.scss']
})
export class AddAlertComponent implements OnInit {

  @Input() tabIndex: any;
  industryType = ['Healthcare',
    'Manufacturing',
    'Agriculture', 'Energy',
    'Smart homes',
    'Transportation'];
  IndustrialDataSource = [
    'Industrial Control Systems',
    'Business Applications',
    'Wearables',
    'Sensors & Devices',
    'Location'
  ]
  trackingDevices = [
    'Bluetooth Low Energy transmitters',

    'GPS tracking tags',

    'Energy sensor trackers',

    'Smart locks',

    'CCTV systems',
    'Automatic lighting controls',

    ' monoxide detectors',
    'IT security solutions'
  ]
  SensorData = [
    ' Status data',
    'Location data',
    'Automation data',
    'Actionable data ']

  deviceType = _deviceType;
  durationInSeconds = 5;
  @Output() dialogClose: any = new EventEmitter();
  newForm: FormGroup;
  assetConn: any = [];
  assetSensors: any = [];
  assetSubSensors: any = [];
  assetTypes: any = [];
  public typeName: any;
  macActive = true;
  macInactive = false;
  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar) {
    this.newForm = this.fb.group({
      PID: [''],
      ALERT_NAME:['',Validators.required],
      ASSET_CONFIG_ID:['',Validators.required],
      THRESHOLD_MIN:['',Validators.required],
      THRESHOLD_MAX:['',Validators.required],
      THRESHOLD_AVG:['',Validators.required],
      // MAC_DETAILS: this.fb.array([])

    })
    console.log(data)
    this.getAllAssets();
    this.data=data;
    if (data && data.MAC_NAME) {
      console.log(data)
      // edit
      this.typeName = data;
      
    
    } else {
      // add
      this.newForm.patchValue({
        PID: data && data.PID?data.PID:'',
      })
    
    }
  }
  get MAC_DETAILS(): FormArray {
    return this.newForm.get('MAC_DETAILS') as FormArray;
  }
  

  ngOnChanges(changes: SimpleChanges): void {

    this.initCall()
  }
  initCall() {
    this.dataService.getAssetConn({}).subscribe(conn => {
      if (conn) {
        this.assetConn = conn.data;
        // get all sensors
        this.dataService.getAllSensors({}).subscribe(sens => {
          this.assetSensors = sens.data;
          //get all asset types
          this.dataService.getAllAssets({}).subscribe(sens => {
            this.assetTypes = sens.data;

            // if edit MAC the call by config ID
            // if (this.typeName) {
            //   this.dataService.getMACByConfigID(this.typeName).subscribe(res => {
            //     console.log(res)
            //     if (res && res.data.length > 0) {
            //       this.newForm.patchValue({
            //         MAC_DETAILS: res.data.map((item: any) => {
            //           return {
            //             PID: item.PID,
            //             MAC_NAME: item.MAC_NAME,
            //             MAC_ADDRESS: item.MAC_ADDRESS,
            //             MAC_STATUS: item.MAC_STATUS ? true : false,
            //             LOCATION: item.LOCATION

            //           }
            //         })
            //       })
            //     }
            //   })
            // }



          })


        })
      }
    })
  }
  ngOnInit(): void {
  }

  async confirmData() {

    // const msg = await this.findInvalidControls();
    // console.log(msg)

    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();
      this.Values.COMPANY_ID = session.COMPANY_ID
      this.Values.CREATED_BY = session.PID;
      console.log(this.Values)
      this.dataService.addMACByConfigID(this.Values).subscribe(res => {
        console.log(res)
        this.dialogClose.emit(true);
        this.confirmClose();
        this.openSnackBar()
      })
    }
  }
  async updateData() {

    // const msg = await this.findInvalidControls();
    // console.log(msg)

    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();
      this.Values.COMPANY_ID = session.COMPANY_ID
      this.Values.CREATED_BY = session.PID;
      console.log(this.Values)
      this.dataService.updateDeviceByID(this.Values).subscribe(res => {
        console.log(res)
        this.dialogClose.emit(true);
        this.confirmClose();
        this.openSnackBar()
      })
    }
  }
  getSensorName(id: number) {
    const name = this.assetSensors.filter((item: any) => {
      return item.PID == id;
    })
    return name[0] ? name[0].NAME : ''
  }
  get Values() {
    return this.newForm.value;
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.newForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        break;
      }
    }
    return invalid;
  }
  confirmClose() {
    this.dialog.closeAll()

  }
  onSENSORChange(event: any) {
    console.log(event)
    const value = this.newForm.get('SENSOR')?.value;
    let params = { SENSOR_TYPE_ID: value };
    this.dataService.getSubSensorCatg(params).subscribe(res => {
      this.assetSubSensors = res.data.map((el: any, index: number) => {

        return el;
      });
    })
  }
  openSnackBar() {
    this._snackBar.openFromComponent(TooltipComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
  addMAC(e: Event) {
    e.stopPropagation()
  }

   getAllAssets() {
    const session =  this.dataService.getSessionData();
    let params = {}
    if (session.COMPANY_TYPE == 'CORP') {
      // get all
      params = { COMPANY_ID: 0 };
    } else {
      params = { COMPANY_ID: session.COMPANY_ID };
    }

    this.dataService.getAssetConfig(params).subscribe(res => {
      this.assetTypes = res.data;
    })
  }

}
