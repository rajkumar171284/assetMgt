import { Component, Inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipComponent } from '../../tooltip/tooltip.component';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  roleData = [
    'LEVEL1',
    'ADMIN']
  @Input() tabIndex:any;
  @Output() dialogClose: any = new EventEmitter();
  newForm: FormGroup;
  public typeName:any;
  accessYes=true;
  accessNo=false;
  companiesList:any=[];

  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,private _snackBar: MatSnackBar) {
    this.newForm = this.fb.group({
      PID: [''],
      FIRST_NAME: ['', Validators.required],
      LAST_NAME: ['', Validators.required],
      LOGIN_NAME: ['', Validators.required],
      PASSWORD: ['', Validators.required],
      ROLE: ['', Validators.required],
      COMPANY_ID: ['', Validators.required],

      WIDGETS_RIGHTS: false,
    })
    // console.log(data)
    if (!data) {
      // add
      const session = this.dataService.getSessionData();
      this.newForm.patchValue({
        // COMPANY_ID: session.COMPANY_ID
      })     

    } else if (data && data.PID) {
      this.typeName=data;
      this.newForm.patchValue(data);
      this.newForm.patchValue({
        WIDGETS_RIGHTS: data.WIDGETS_RIGHTS ? true : false
      });

    }
    this.getAllComp();
  }

  ngOnInit(): void {

  }
async getAllComp() {
    const session = await this.dataService.getSessionData();
  
    this.dataService.getAllCompanies().subscribe(res => {
      this.companiesList = res.data;
    })
  }
  async confirmData() {

    // const msg = await this.findInvalidControls();
    console.log(this.newForm)

    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();
      this.Values.CREATED_BY = session.PID;
      // console.log(this.Values)
      this.dataService.createUser(this.Values).subscribe(res => {
        console.log(res)
        this.dialogClose.emit(true);
        this.confirmClose();
        this.openSnackBar('')
      },(err)=>{
        this.openSnackBar(err)
      })
    }
  }
  openSnackBar(str:any) {
    this._snackBar.openFromComponent(TooltipComponent, {
      duration: 5 * 1000,
      data:str
    });
  }
  get Values() {
    return this.newForm.value;
  }
  confirmClose() {
    this.dialog.closeAll()

  }


}
