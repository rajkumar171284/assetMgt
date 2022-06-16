import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import {_assetTypes} from '../../../myclass';
const tbl_name = 'asset_tbl_';
@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent implements OnInit {
  @Output() dialogClose: any = new EventEmitter();
  newForm: FormGroup;
  public typeName: any;

  assetTypes = _assetTypes
  constructor(private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar) {

    this.assetTypes.map(item => {
      return
    })
    this.newForm = this.fb.group({
      PID: [''],
      NAME: ['', Validators.required],
      ASSET_TYPE: ['', Validators.required],
      COMPONENTS: [''],
    })
    console.log(data)
    if (data && !data.PID) {
      console.log(data)
      // add
    } else if (data && data.PID) {
      this.typeName = data;
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
      this.Values.NAME =this.Values.NAME.toUpperCase();
      this.Values.ASSET_TYPE =this.Values.ASSET_TYPE.toUpperCase();
      // console.log(this.Values)
      this.dataService.addAsset(this.Values).subscribe(res => {
        console.log(res)
        this.dialogClose.emit(true);
        this.confirmClose();
        this.openSnackBar(res.msg)
      })
    }
  }
  get Values() {
    return this.newForm.value;
  }
  confirmClose() {
    this.dialog.closeAll()

  }
  openSnackBar(data: any) {
    this._snackBar.openFromComponent(TooltipComponent, {
      duration: 5 * 1000,
      data: data
    });
  }
}
