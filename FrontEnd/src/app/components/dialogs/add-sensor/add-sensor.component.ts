import { Component, Inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-add-sensor',
  templateUrl: './add-sensor.component.html',
  styleUrls: ['./add-sensor.component.scss']
})
export class AddSensorComponent implements OnInit {
  @Input() tabIndex:any;
  @Output() dialogClose: any = new EventEmitter();
  newForm: FormGroup;
  public typeName:any;
  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.newForm = this.fb.group({
      PID: [''],
      NAME: ['', Validators.required],
    })
    console.log(data)
    if (data && !data.PID) {
      console.log(data)
      // add
     
     

    } else if (data && data.PID) {
      this.typeName=data;
      this.newForm.patchValue(data);
     
    }
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
      // console.log(this.Values)
      this.dataService.addSensor(this.Values).subscribe(res => {
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
