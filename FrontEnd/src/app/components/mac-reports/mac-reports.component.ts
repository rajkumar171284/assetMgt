import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { config } from '../../myclass';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TooltipComponent } from '../../components/tooltip/tooltip.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-mac-reports',
  templateUrl: './mac-reports.component.html',
  styleUrls: ['./mac-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacReportsComponent implements OnInit, OnChanges {
  dataSource = [];
  displayedColumns: string[] = [
    "PID", "MAC_ADDRESS", "ASSET_CONFIG_ID", "VALUE", "STATUS", "CREATED_DATE"]
  constructor(private dataService: AuthService, public dialog: MatDialog, private ref: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes')
   
  }

  ngOnInit(): void {
    this.getAllMACdata();
  }


  getAllMACdata() {

    this.dataService.getMACstatus({}).subscribe(res => {
      console.log(res)

      this.dataSource = res.data;
      this.ref.detectChanges();
    })
  }

}
