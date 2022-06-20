import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ResizeEvent } from "angular-resizable-element";
declare let $: any;
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
    $(".resizable").resizable({
      stop: function( event:Event, ui:any ) {

        let height = $("#resizable").height(); 

        let width = $("#resizable").width(); 
        console.log('width',width,'height',height)
    } 
    });
    // $(".resizable").on('resize', function (e: Event) {
    //   console.log('resizable')
    // });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.WIDGET_REQUEST)
    this.getAllMACdata();
  }

  getAllMACdata() {

    this.dataService.getMACByConfigID({PID:this.WIDGET_REQUEST.ASSET_CONFIG_ID}).subscribe(res => {
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
