import { Component, Inject, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { _deviceType } from '../../../myclass';

@Component({
  selector: 'app-add-asset-config',
  templateUrl: './add-asset-config.component.html',
  styleUrls: ['./add-asset-config.component.scss'], providers: [AuthService]
})
export class AddAssetConfigComponent implements OnInit, OnChanges {
  @Input() tabIndex: any;
  companiesList: any = [];

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
    'Actionable data ',]
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
  public demo1TabIndex = 0;
  deviceType = _deviceType;

  conn = ['MQTT'];
  configRouter = ['NODEJS', 'PYTHON', 'MQTT'];
  isChecked!: boolean;
  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar) {
    this.newForm = this.fb.group({
      PID: [''],
      CONFIG_NAME: ['', Validators.required],
      ASSET_ID: ['', Validators.required],
      INDUSTRIAL_TYPE: ['', Validators.required],
      INDUSTRIAL_DATA_SOURCE: [''],
      CONNECTION_TYPE: [''],
      TRACKING_DEVICE: [''],
      SENSOR: ['', Validators.required],
      SENSOR_CATEGORY: [''],
      SENSOR_DATA_TYPE: ['', Validators.required],
      COMPANY_ID: ['', Validators.required],
      METHOD: [],
      HOST: '',
      STATIC_COORDS: ['', Validators.required],
      MAC_DETAILS: this.fb.array([]),
      PARAMETERS: this.fb.array([])

    })

    if (data) {
      // console.log(data)
      if (data.PARAMETERS) {
        data.PARAMETERS = JSON.parse(data.PARAMETERS);
        
        for (let a of data.PARAMETERS) {
          const item = this.fb.group({
            PID: '',
            INPUT_NAME: [a.INPUT_NAME,Validators.required],
            ZONE:a.ZONE,UNIT:a.UNIT,
            INPUT_STATUS: a.INPUT_STATUS,
          })
          this.PARAMETERS_DETAILS.push(item)
        }
      }
      // edit
      this.typeName = data;
      this.newForm.patchValue(data);
      this.newForm.patchValue({
        SENSOR: parseInt(data.SENSOR),
        ASSET_TYPE: parseInt(data.ASSET_TYPE),
        STATIC_COORDS: data.STATIC_COORDS == 1 ? true : false,      

      })
     
    } else {
      // add new- logic if any

    }


  }
  // pushParameters(data: any) {
  //   const params = JSON.parse(data.PARAMETERS);

  //   for (let a of params) {
  //     let item = this.newForm.get('PARAMETERS') as FormGroup;

  //     item = this.fb.group({
  //       PID: '',
  //       INPUT_NAME: a.INPUT_NAME,
  //       INPUT_STATUS: a.INPUT_STATUS
  //     })
  //     this.PARAMETERS_DETAILS.push(item)
  //   }
    
  // }

  removeParameters(i:number){
   this.PARAMETERS_DETAILS.removeAt(i)
  }
  get PARAMETERS_DETAILS(): FormArray {
    return this.newForm.get('PARAMETERS') as FormArray;
  }

  get MAC_DETAILS(): FormArray {
    return this.newForm.get('MAC_DETAILS') as FormArray;
  }
  changeValue(e: any) {

  }
  updateMAC() {
    const item = this.fb.group({
      PID: '',
      MAC_NAME: ['', Validators.required],
      MAC_ADDRESS: ['', Validators.required],
      MAC_STATUS: true,
      LOCATION: ['', Validators.required],
      LATITUDE: [''],
      LONGITUDE: ''
    })

    this.MAC_DETAILS.push(item)

  }

  ngOnChanges(changes: SimpleChanges): void {

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
            if (this.typeName) {
              this.dataService.getMACByConfigID(this.typeName).subscribe(res => {
                // console.log(res)
                this.getAllComp();
                if (res && res.data.length > 0) {
                  this.newForm.patchValue({
                    MAC_DETAILS: res.data.map((item: any) => {
                      return {
                        PID: item.PID,
                        MAC_NAME: item.MAC_NAME,
                        MAC_ADDRESS: item.MAC_ADDRESS,
                        MAC_STATUS: item.MAC_STATUS ? true : false,
                        LOCATION: item.LOCATION,
                        LATITUDE: item.LATITUDE,
                        LONGITUDE: item.LONGITUDE

                      }
                    })
                  })
                }
              })
            } else {
              // new asset config
              // console.log('sds')
              this.getAllComp();
            }



          })


        })
      }
    })
  }
  ngOnInit(): void {
    this.updateMAC();
    this.initCall();
  }
  getAllComp() {
    // const session = await this.dataService.getSessionData();

    this.dataService.getAllCompanies().subscribe(res => {
      this.companiesList = res.data;
    })
  }
  async confirmData() {

    // const msg = await this.findInvalidControls();
    // console.log(msg)

    if (this.newForm.get('COMPANY_ID')?.valid && this.newForm.get('CONFIG_NAME')?.valid && this.newForm.get('ASSET_ID')?.valid && this.newForm.get('INDUSTRIAL_TYPE')?.valid && this.newForm.get('INDUSTRIAL_DATA_SOURCE')?.valid && this.newForm.get('CONNECTION_TYPE')?.valid
      && this.newForm.get('TRACKING_DEVICE')?.valid && this.newForm.get('SENSOR')?.valid && this.newForm.get('SENSOR_CATEGORY')?.valid && this.newForm.get('SENSOR_DATA_TYPE')?.valid) {
      this.demo1TabIndex = 1;

    }

    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();

      this.Values.CREATED_BY = session.PID;
      this.Values.CONFIG_NAME = this.Values.CONFIG_NAME.toUpperCase();
      this.Values.PARAMETERS = JSON.stringify(this.Values.PARAMETERS);
      this.dataService.addAssetConfig(this.Values).subscribe(res => {
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
  async updateDeviceDetails() {
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
  unselect(e: any): void {
    this.newForm.patchValue({
      CONNECTION_TYPE: ''
    })
  }
  addParameters() {

    const item = this.fb.group({
      PID: '',
      INPUT_NAME: ['', Validators.required],
      UNIT:'',ZONE:'',
      INPUT_STATUS: true,
    })

    this.PARAMETERS_DETAILS.push(item)
    // console.log(this.PARAMETERS_DETAILS)
  }


}
