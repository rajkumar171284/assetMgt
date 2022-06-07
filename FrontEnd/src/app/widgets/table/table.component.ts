import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnChanges {
  @Input() WIDGET_REQUEST: any;
  @Input() ASSET_CONFIG_ID: any;
  dataSource: any = [];
  displayedColumns: string[] = [
    "MAC_ADDRESS", "STATUS", "CREATED_DATE"]

  constructor(private dataService: AuthService, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.WIDGET_REQUEST)
    this.getAllMACdata();
  }

  getAllMACdata() {

    this.dataService.getMACstatusByAssetConfigID(this.WIDGET_REQUEST).subscribe(res => {
      console.log(res)
     
      this.dataSource=res.data.map((res:any)=>res);
      // this.ref.detectChanges();
      // res.data.forEach((_item: any, index: number) => {
      //   console.log(index)
      //     this.dataSource.push(_item)
          
        
      // });
      this.ref.detectChanges();
    })
  }


}
