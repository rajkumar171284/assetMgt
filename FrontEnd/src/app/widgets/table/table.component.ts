import { Component, AfterViewInit, DoCheck, ViewChild, ElementRef, ViewContainerRef, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ResizeEvent } from "angular-resizable-element";
import { XAxisService } from '../../services/x-axis.service';

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
  constructor(public service: XAxisService,public dataService: AuthService, private ref: ChangeDetectorRef) { }
  @ViewChild("table") divBoard!: ElementRef;
  divElement!: any;

  ngAfterViewInit(): void {
    this.divElement = this.divBoard.nativeElement;
  }
  ngOnInit(): void {
    
    
  }
  ngDoCheck(): void {

    const status = this.dataService.getAccess();
    if (status) {
      this.watchSize();
    }
  }
  watchSize() {
    // const id = this.widgetIndex.toString();
    let that = this;
    let x = that.divElement;
    // console.log(x)
    $(x).resizable({
      stop: function (event: Event, ui: any) {
        // console.log(ui)
        let height: number = $(ui.size.height)[0];
        let width: number = $(ui.size.width)[0];
        let top: number = $(ui.position.top)[0];
        let left: number = $(ui.position.left)[0];
        const newSize: any = {
          width: width, height: height, top: top,
          left: left
        }
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);

        // sending/emitting data to parent-dashboard.ts for saving into api
        that._widgetData.emit(that.WIDGET_REQUEST)
      }
    });
    $(x).draggable({
      stop: function (event: Event, ui: any) {
        // console.log(ui)
        let top: number = $(ui.position.top)[0];
        let left: number = $(ui.position.left)[0];
        const orgSize = JSON.parse(that.WIDGET_REQUEST.WIDGET_SIZE);
        const newSize = {
          width: orgSize.width,
          height: orgSize.height,
          top: top, left: left
        }
        that.WIDGET_REQUEST.WIDGET_SIZE = JSON.stringify(newSize);

        // sending/emitting data to parent-dashboard.ts for saving into api
        that._widgetData.emit(that.WIDGET_REQUEST)
      }
    })

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
