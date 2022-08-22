import { Component, OnInit,Inject,Input } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_SNACK_BAR_DATA,MatSnackBarRef } from '@angular/material/snack-bar';
import {XAxisService} from '../../services/x-axis.service';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input() responseMessage:any;
  // public data: any
  constructor(private exchangeData:XAxisService,public snackBarRef: MatSnackBarRef<TooltipComponent>,private _snackBar: MatSnackBar,@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    console.log(this.data)
    // this.data=data;
  }
  
  ngOnInit(): void {
    console.log(this.data)
    this.exchangeData.currSnackbar.subscribe(res=>{
      console.log(res)
         this.data=res;
        //  this._snackBar.open(res, 'action', {
        //   duration: 2000,
        //   panelClass: ['blue-snackbar']
        // });
    })
  }
  openSnackBar(message: string, action: string) {
    console.log(message, action)
    this.exchangeData.currSnackbar.subscribe(res=>{
      console.log(res)
      this._snackBar.open(res, action);
    })
    
  }

}
