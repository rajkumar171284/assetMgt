import { Component, Inject, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { _deviceType } from '../../../myclass';

@Component({
  selector: 'app-add-mac-details',
  templateUrl: './add-mac-details.component.html',
  styleUrls: ['./add-mac-details.component.scss']
})
export class AddMacDetailsComponent implements OnInit {
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
      MAC_DETAILS: this.fb.array([])

    })

    if (data) {
      console.log(data)
      // edit
      this.typeName = data;
      const item = this.fb.group({
        PID: data.PID,
        MAC_NAME: data.MAC_NAME.toLowerCase(),
        MAC_ADDRESS: data.MAC_ADDRESS,
        MAC_STATUS: data.MAC_STATUS ? true : false,
        LOCATION: data.LOCATION,
        // DEVICE_TYPE:['', Validators.required]
      })
      this.MAC_DETAILS.push(item)
      // this.newForm.patchValue({
      //   MAC_DETAILS:this.MAC_DETAILS
      // });
    } else {
      // add
      this.updateMAC();
    }
  }
  get MAC_DETAILS(): FormArray {
    return this.newForm.get('MAC_DETAILS') as FormArray;
  }
  updateMAC() {
    const item = this.fb.group({
      PID: '',
      MAC_NAME: ['', Validators.required],
      MAC_ADDRESS: ['', Validators.required],
      MAC_STATUS: true,
      LOCATION: ['', Validators.required],
      // DEVICE_TYPE:['', Validators.required]
    })

    this.MAC_DETAILS.push(item)

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
    // this.updateMAC();
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
    this.updateMAC()
  }

  updateConfig() {

  }
  // async updateMACDetails() {
  //   if (this.newForm.valid) {
  //     const session = await this.dataService.getSessionData();
  //     this.Values.COMPANY_ID = session.COMPANY_ID
  //     this.Values.CREATED_BY = session.PID;
  //     console.log(this.Values)
  //     this.dataService.updateDeviceByID(this.Values).subscribe(res => {
  //       console.log(res)
  //       this.dialogClose.emit(true);
  //       this.confirmClose();
  //       this.openSnackBar()
  //     })
  //   }

  // }

}
