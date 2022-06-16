import { Component, OnInit,Inject,Input } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input() responseMessage:any;
  // public data: any
  constructor(private _snackBar: MatSnackBar,@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    console.log(data)
    // this.data=data;
  }
  // constructor(private _snackBar: MatSnackBar,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) {
  //   console.log(data)
  //   // this.data=data;
  // }
  ngOnInit(): void {

  }
  openSnackBar(message: string, action: string) {
    console.log(message, action)
    this._snackBar.open(message, action);
  }

}
