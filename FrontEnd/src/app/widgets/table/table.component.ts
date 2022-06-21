import { Component, OnInit, Input,Output, EventEmitter,OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  @Output() _widgetData = new EventEmitter();

  dataSource: any = [];
  displayedColumns: string[] = [
    "MAC_ADDRESS", "STATUS", "CREATED_DATE"]
    public height: any;
    public width: any;
  constructor(private dataService: AuthService, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    let that=this;
    $(".resizable").resizable({
      stop: function (event: Event, ui: any) {

        that.height = $(ui.size.height)[0];

        that.width = $(ui.size.width)[0];
       
        
        const params: any = {
          width: that.width, height: that.height
        }
        that.WIDGET_REQUEST.WIDGET_SIZE=JSON.stringify(params); 
        console.log(that.WIDGET_REQUEST.WIDGET_SIZE)      
      }
    });
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.WIDGET_REQUEST)
    this.getAllMACdata();
  }
  saveWidget() {
  
    this._widgetData.emit(this.WIDGET_REQUEST)
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

  getProp(type:string){
    const prop =JSON.parse(this.WIDGET_REQUEST.WIDGET_SIZE)
    if(type=='W'){
       return prop.width
    }
    if(type=='H'){
      return prop.height
    }
  }
}
