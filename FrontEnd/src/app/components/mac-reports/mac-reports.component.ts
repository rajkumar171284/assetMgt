import { Component, OnInit,OnDestroy, Input,ViewChild, OnChanges, AfterViewInit ,SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { config } from '../../myclass';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TooltipComponent } from '../../components/tooltip/tooltip.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { __deviceHistory } from '../../myclass';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mac-reports',
  templateUrl: './mac-reports.component.html',
  styleUrls: ['./mac-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacReportsComponent implements OnInit, OnChanges,OnDestroy {
  @ViewChild(MatSort)
  sort!: MatSort;
  dataSource = new TableVirtualScrollDataSource();
  subs1!:Subscription;
  displayedColumns: string[] = [
    // "PID",
     "DEVICE_ID", "CONFIG_NAME", "VALUE", "STATUS", "LAST_UPDATE_TIME"]
  constructor(private dataService: AuthService, public dialog: MatDialog, private ref: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes')
   
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.getAllMACdata();
  }


  getAllMACdata() {

  
    this.subs1= this.dataService.getAllMACstatus().subscribe(res => {
      console.log(res)
      

      this.dataSource = new TableVirtualScrollDataSource(res.data);
      // .map((item:__deviceHistory)=>item );
      this.dataSource.sort = this.sort;
      this.ref.detectChanges();
    })
  }
  ngOnDestroy(): void {
      this.subs1.unsubscribe();
  }

}
