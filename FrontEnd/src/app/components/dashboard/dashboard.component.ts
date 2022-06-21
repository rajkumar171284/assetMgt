import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, HostListener,OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WidgetComponent } from '../../components/widget/widget.component';
import { AuthService } from '../../services/auth.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ResizeEvent } from "angular-resizable-element";
import { from, Observable, of } from 'rxjs';

declare let $: any;
// import {
//   AngularResizeElementDirection,
//   AngularResizeElementEvent
// } from "angular-resize-element";
interface Item {
  PID: number;
}
interface chartItem {
  PID: number;
  NAME: string; CHART_DATA: any;
  CHART_TYPE: any;
  SQL_QUERY: any;
  IS_DRAGGED: number;
}
class chartitem {
  PID = 0;
  NAME = '';
  CHART_DATA = '';
  CHART_TYPE = '';
  SQL_QUERY = '';
  IS_DRAGGED = 0;
}
interface toDrag{
  isDraggable:any;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  
  dragDisabledArr:any[]=[];
  isVisible = false;
  isWidgetOpen = true;
  dragStatus: number = 0;
  constructor(public dialog: MatDialog, private dataService: AuthService, private ref: ChangeDetectorRef) { }
  dataSource: chartItem[] = [];
  doneList: chartItem[] = []
  overAllCharts: any = [];
  undraggedWidget: any[] = ['0'];
  draggedWidget: any[] = ['0'];
  toEditRequest: any;
  dragDisabled = false;
  hide = false;
  dataFromMessages$: Observable<any> | undefined;
  // resize

  public data: any = {};
  @ViewChild('container', { read: ElementRef })
  public readonly containerElement: any;

  @ViewChild('element') theElement: any;

  getElement() {
    return this.theElement.nativeElement;
  }
//  ngOnChanges(changes: SimpleChanges): void {
//   console.log('resizable')
//  }
  ngAfterViewInit() {
    // const element = this.getElement();
    // element.resizable({ handles: "all" });
  }

  ngOnInit(): void {

    this.dataService.getMqtt({}).subscribe(res=>{
      console.log(res)
    })

    // $(".resizable").resizable({
    //   stop: function( event:Event, ui:any ) {

    //     let height = $("#resizable").height(); 

    //     let width = $("#resizable").width(); 
    //     console.log('width',width,'height',height)
    // } 
    // });
    // $(".resizable").on('resize', function (e: Event) {
    //   console.log('resizable')
    // });

    this.data.width = 200;
    this.data.height = 200;
    // console.log('dash')
    this.getSession();
    this.getMappedChartRequest();


  }
  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   console.log('resize starts')
  //   // this.dragDisabled = true;
  // }
 
  async getSession() {
    const session = await this.dataService.getSessionData();
    if (session && session.ROLE == 'ADMIN') {
      this.dragDisabled = false;
      this.isWidgetOpen = true;
    } else {
      this.isWidgetOpen = false;
      this.dragDisabled = true;
    }
    //  console.log(this.dragDisabled)
  }

  async getMappedChartRequest() {
    const session = await this.dataService.getSessionData();
    this.dataService.getAllChartRequests({ IS_DRAGGED: 1 }).subscribe(res => {

      this.doneList = res.data.map((el: chartItem) => {
        return el;
      });
      this.draggedWidget = res.data.length > 0 ? this.doneList.map(x => {
        return x.PID.toString();
      }) : ['0'];
       of(this.doneList).subscribe((res:any)=>{
        console.log(res)
        res.dragDisabled=false;
        this.dragDisabledArr=res;
      })
      
      console.log(this.dragDisabledArr)
      this.getAllChartRequest();

    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(WidgetComponent, {
      width: '800px',
      data: this.toEditRequest ? this.toEditRequest : null
    });
    dialogRef.afterClosed().subscribe(result => {
      // call all charts
      this.getAllChartRequest();
      this.getMappedChartRequest();
    });
  }
  async editRequest(pid: any) {
    const data = await this.getRequestDetails(pid, 'json');

    this.toEditRequest = data;
    this.openDialog();
  }

  async getAllChartRequest() {
    const session = await this.dataService.getSessionData();
    this.dataService.getAllChartRequests({ IS_DRAGGED: 0 }).subscribe(res => {
      this.dataSource = res.data.map((el: chartItem) => {
        return el;
      });
      this.overAllCharts = this.dataSource.concat(this.doneList);
      this.undraggedWidget = res.data.map((itm: chartItem) => {
        return itm.PID.toString();

      })
      // console.log(this.undraggedWidget)
    })
  }

  onDrop(event: CdkDragDrop<string[]>) {
    // console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    const PID = parseInt(event.item.data);
    if (PID) {
      this.changeStatus(PID)
    }

  }
  async changeStatus(pid: number) {
    // const data = await this.getRequestDetails(pid, 'json');
    let params = {
      IS_DRAGGED: 1,
      PID: pid
    }
    // console.log(data)
    this.dataService.chartRequestChangeStatus(params).subscribe(res => {
      this.getMappedChartRequest();
      this.getAllChartRequest();
    })
  }
  removeRequest(item: any) {
    this.dataService.deleteChartRequests({ PID: item }).subscribe(res => {
      this.ngOnInit();
    })
  }
  getRequestDetails(PID: any, val: string) {
    if (PID) {
      const value = this.overAllCharts.filter((obj: chartItem) => {
        return obj.PID == parseInt(PID);
      })
      if (value[0] && val == 'n') {
        return value[0].WIDGET_TYPE;
      }
      else if (value[0] && val == 'd') {
        return value[0].WIDGET_DATA;
      } else if (value[0] && val == 'json') {
        return value[0]
      } else if (value[0] && val == 'l') {
        return value[0].CHART_TYPE
      } else if (value[0] && val == 'IMG') {
        return value[0].WIDGET_IMG;
      }
      else if (value[0] && val == 'config') {
        return value[0].CONFIG_NAME;
      }
      else if (value[0] && val == 'WIDGET_TYPE') {
        return value[0].WIDGET_TYPE ? value[0].WIDGET_TYPE.toUpperCase() : '';
      }
      else if (value[0] && val == 'CHART_NAME') {
        return value[0].CHART_NAME ? value[0].CHART_NAME.toUpperCase() : '';
      }
      else if (value[0] && val == 'size') {
        return value[0].WIDGET_SIZE;
      }

    }
  }

  closePanel() {

  }

  // onResizeEnd(event: any): void {
  //   console.log('Element was resized', event);
  // }
  // visible: boolean = false;
  //   breakpoint: number = 768;
  // onResize2(event:any) {
  //   console.log(event,event.target)
  //   const w = event.target.innerWidth;
  //   // if (w >= this.breakpoint) {
  //   //   this.visible = true;
  //   // } else {
  //   //   // whenever the window is less than 768, hide this component.
  //   //   this.visible = false;
  //   // }
  // }
  async saveWidget(data:any){
console.log('data',data)
  

    if (data) {
      const session = await this.dataService.getSessionData();
      data.COMPANY_ID = session.COMPANY_ID;
      data.CREATED_BY = session.PID;
     
      data.SQL_QUERY ='sql';
     
      this.dataService.addChartRequest(data).subscribe(res => {
        console.log(res)
       
      })
    }
  }

}
