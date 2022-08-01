import { Component, Inject, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { _deviceType, _alertType } from '../../../myclass';

@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.scss']
})
export class AddAlertComponent implements OnInit {
  alertTypes = _alertType;
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
  parameterTypes: any = [];
  public typeName: any;
  macActive = true;
  macInactive = false;
  loading = true;
  THRESHOLD_RANGE1: boolean = true;
  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar) {
    this.newForm = this.fb.group({
      PID: [''],
      ALERT_NAME: ['', Validators.required],
      ASSET_CONFIG_ID: [''],
      THRESHOLD_MIN: [''],
      THRESHOLD_MAX: [''],
      THRESHOLD_AVG: [''],
      PARAMETER: ['', Validators.required],
      ALERT_TYPE: ['', Validators.required],
      THRESHOLD_RANGE: [true],
      COLOR: [''],

    })
   
    this.data = data;
    if (data) {
      // edit
      this.typeName = data;
      this.newForm.patchValue(data)

    } else {
      // add


    }
  }
  get MAC_DETAILS(): FormArray {
    return this.newForm.get('MAC_DETAILS') as FormArray;
  }


  ngOnChanges(changes: SimpleChanges): void {

    // this.initCall()
    
  }
  initCall() {

    this.dataService.getAssetConn({}).subscribe(conn => {
      if (conn) {
        this.assetConn = conn.data;
        // get all sensors
        this.dataService.getAllSensors({}).subscribe(sens => {
          this.assetSensors = sens.data;
          //get all asset config types
          this.getAllAssetConfigs()
        })
      }
    })
  }
  getAllAssetConfigs() {
    const session = this.dataService.getSessionData();
    let params = {}
    if (session.COMPANY_TYPE == 'CORP') {
      // get all
      params = { COMPANY_ID: 0 };
    } else {
      params = { COMPANY_ID: session.COMPANY_ID };
    }
    this.dataService.getAssetConfig(params).subscribe(res => {
      this.assetTypes = res.data;
      this.loading = false;

    })
  }
  getPARAMETERS() {
    const pid = this.Values.ASSET_CONFIG_ID;
    // console.log(pid)
    this.parameterTypes = [];
    let index = this.assetTypes.map((a: any) => a.PID).indexOf(pid);
    if (index != -1 && this.assetTypes[index].PARAMETERS) {
      this.parameterTypes = JSON.parse(this.assetTypes[index].PARAMETERS);
    }

  }
  ngOnInit(): void {
    
    // this.setValidate();
    this.initCall();
  }

  setValidate(){
    const value= this.newForm.get('THRESHOLD_RANGE')?.value;
      console.log(value)
      if (value) {
        this.newForm.get('THRESHOLD_MIN')?.setValidators(Validators.required);
        this.newForm.get('THRESHOLD_MAX')?.setValidators(Validators.required);
        this.newForm.get('THRESHOLD_AVG')?.clearValidators();

        // this.newForm.patchValue({

        //   THRESHOLD_MIN: ['', Validators.required],
        //   THRESHOLD_MAX: ['', Validators.required],
        //   THRESHOLD_AVG: [''],
        // })
      } else {
        // absolute value
        this.newForm.get('THRESHOLD_MIN')?.clearValidators();
        this.newForm.get('THRESHOLD_MAX')?.clearValidators();
        this.newForm.get('THRESHOLD_AVG')?.setValidators(Validators.required);
        // this.newForm.patchValue({
        //   THRESHOLD_MIN: [''],
        //   THRESHOLD_MAX: [''],
        //   THRESHOLD_AVG: ['', Validators.required],
        // })
      }
  }

  async confirmData() {

    // const msg = await this.findInvalidControls();
    console.log(this.THRESHOLD_RANGE1)
    console.log(this.Values)
    if (this.newForm.valid) {
      this.loading = true;
      const session = await this.dataService.getSessionData();
      this.Values.COMPANY_ID = session.COMPANY_ID
      this.Values.CREATED_BY = session.PID;

      console.log(this.Values)
      this.dataService.addThresholdAlert(this.Values).subscribe(res => {
        // console.log(res)
        this.dialogClose.emit(true);
        this.confirmClose();
        this.openSnackBar()
        this.loading = false;
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
      // console.log(this.Values)
      this.dataService.updateDeviceByID(this.Values).subscribe(res => {
        // console.log(res)
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
    // console.log(event)
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
  // addMAC(e: Event) {
  //   e.stopPropagation()
  // }
  setThreshold(active: boolean) {
    this.THRESHOLD_RANGE1 = active;
    // if (!active) {

    this.newForm.patchValue({
      THRESHOLD_MIN: null, THRESHOLD_MAX: null, THRESHOLD_AVG: null
    })

    // }
    // this.newForm.get('THRESHOLD_RANGE')?.valueChanges.subscribe(value => {
    //   console.log(value)
    //   if (value) {
    //     this.newForm.get('THRESHOLD_MIN')?.setValidators(Validators.required);
    //     this.newForm.get('THRESHOLD_MAX')?.setValidators(Validators.required);
    //     this.newForm.get('THRESHOLD_AVG')?.clearValidators();

    //     // this.newForm.patchValue({

    //     //   THRESHOLD_MIN: ['', Validators.required],
    //     //   THRESHOLD_MAX: ['', Validators.required],
    //     //   THRESHOLD_AVG: [''],
    //     // })
    //   } else {
    //     // absolute value
    //     this.newForm.get('THRESHOLD_MIN')?.clearValidators();
    //     this.newForm.get('THRESHOLD_MAX')?.clearValidators();
    //     this.newForm.get('THRESHOLD_AVG')?.setValidators(Validators.required);
    //     // this.newForm.patchValue({
    //     //   THRESHOLD_MIN: [''],
    //     //   THRESHOLD_MAX: [''],
    //     //   THRESHOLD_AVG: ['', Validators.required],
    //     // })
    //   }
    // })

    console.log(this.newForm)

  }


}
