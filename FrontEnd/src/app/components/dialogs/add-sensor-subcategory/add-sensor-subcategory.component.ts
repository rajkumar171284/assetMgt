import { Component, Inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-add-sensor-subcategory',
  templateUrl: './add-sensor-subcategory.component.html',
  styleUrls: ['./add-sensor-subcategory.component.scss'], providers: [AuthService]
})
export class AddSensorSubcategoryComponent implements OnInit {
  public typeName:any;
  @Input() tabIndex:any;
  @Output() dialogClose: any = new EventEmitter();
  newForm: FormGroup;
  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.newForm = this.fb.group({
      PID: [''],
      SENSOR_TYPE_ID: ['', Validators.required],
      CATEGORY_NAME: ['', Validators.required],
      NAME: [''],
    })
    console.log(data)
    if (data && !data.SENSOR_TYPE_ID) {
      console.log(data)
      // add
      this.newForm.patchValue({
      
        NAME:data.NAME,
        SENSOR_TYPE_ID:data.PID
      });
     
    }else if (data && data.SENSOR_TYPE_ID){
      this.typeName=data;
      this.newForm.patchValue(data);
      this.newForm.patchValue({
        NAME:data.NAME
      });
    }
  }

  ngOnInit(): void {
  }

  async confirmData() {

    // const msg = await this.findInvalidControls();
    // console.log(msg)

    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();
      // this.Values.COMPANY_ID = session.COMPANY_ID
      this.Values.CREATED_BY = session.PID;
      // console.log(this.Values)
      this.dataService.addSubSensor(this.Values).subscribe(res => {
        console.log(res)
        this.dialogClose.emit(true);
        this.confirmClose();
      })
    }
  }
  get Values() {
    return this.newForm.value;
  }
  confirmClose() {
    this.dialog.closeAll()

  }
}
