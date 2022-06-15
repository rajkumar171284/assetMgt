import { Component, Inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent  {
  roleData = [
    'LEVEL1',
    'ADMIN']
  @Input() tabIndex:any;
  @Output() dialogClose: any = new EventEmitter();
  newForm: FormGroup;
  public typeName:any;
  accessYes=true;
  accessNo=false;
  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.newForm = this.fb.group({
      PID: [''],
      COMPANY_NAME: ['', Validators.required],
      COMPANY_ADDRESS_LINE1: [''],
      COMPANY_ADDRESS_LINE2: ['', Validators.required],
      COMPANY_TYPE: ['', Validators.required],
      STATUS: ['', Validators.required],
      LOGO: ['', Validators.required],
    })
   
    if (!data) {
      // add
      const session = this.dataService.getSessionData();
      this.newForm.patchValue({
        COMPANY_TYPE:'CLIENT',
        STATUS: true
      })     

    } else if (data && data.PID) {
      this.typeName=data;
      this.newForm.patchValue(data);
      this.newForm.patchValue({
        // LOGO:data.LOGO,
        STATUS: data.STATUS ? true : false,

      });

    }
  }

  ngOnInit(): void {
  }

  async confirmData() {

    // const msg = await this.findInvalidControls();
    console.log(this.newForm)

    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();
      this.Values.CREATED_BY = session.PID;
      // console.log(this.Values)
      this.dataService.createCompany(this.Values).subscribe(res => {
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
