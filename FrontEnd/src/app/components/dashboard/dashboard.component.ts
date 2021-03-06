import { Component, DoCheck, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WidgetComponent } from '../../components/widget/widget.component';
import { AuthService } from '../../services/auth.service';
import { CdkDragDrop, CdkDragStart, CdkDragMove, CdkDragEnd, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ResizeEvent } from "angular-resizable-element";
import { forkJoin, from, Observable, of, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipComponent } from '../../components/tooltip/tooltip.component';
import { __addAssetDevice, widgetResponse, _widgetRequest } from '../../myclass';
import { I } from '@angular/cdk/keycodes';
import * as moment from 'moment';
import { switchMap } from 'rxjs/operators'
import { XAxisService } from '../../services/x-axis.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let $: any;
interface Item {
  PID: number;
}
interface chartItem {
  PID: number;
  NAME: string; CHART_DATA: any;
  CHART_TYPE: any;
  SQL_QUERY: any;
  IS_DRAGGED: number;
  dragDisabled: boolean;

}
class chartitem {
  PID = 0;
  NAME = '';
  CHART_DATA = '';
  CHART_TYPE = '';
  SQL_QUERY = '';
  IS_DRAGGED = 0;
  dragDisabled = false;

}
interface toDrag {
  isDraggable: any;
}
interface dragOption {
  dragDisabled: false
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('widgetIndex') widgetIndex!: any;
  errMessage: any;
  // dragDisabledArr: Observable<dragOption[]> | undefined;
  dragDisabledArr: any[] = [];
  isVisible = false;
  isWidgetOpen = true;
  dragStatus: number = 0;
  newForm: FormGroup;
  constructor(private fb: FormBuilder, public service: XAxisService, private _snackBar: MatSnackBar, public dialog: MatDialog, public dataService: AuthService, private ref: ChangeDetectorRef) {
    this.newForm = this.fb.group({
      PID: [''],
      COMPANY_ID: ['', Validators.required]

    })

  }
  dataSource: chartItem[] = [];
  doneList: chartItem[] = []
  overAllCharts: any = [];
  undraggedWidget: any[] = ['0'];
  draggedWidget: any[] = ['0'];
  draggedWidget$: _widgetRequest[] = [];
  undraggedWidget$: any[] = [];

  toEditRequest: any;
  dragDisabled = false;
  hide = false;
  widgetResponse: any = new widgetResponse()
  loader = true;
  dataFromMessages$: Observable<any> | undefined;

  // public data: any = {};
  @ViewChild('container', { read: ElementRef })
  public readonly containerElement: any;

  @ViewChild('element') theElement: any;
  todayStartDate: any = moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss").toString();
  todayEndDate: any = moment().endOf('day').toString();
  WIDGET_REQUEST: any;
  WIDGETREQUEST$!: Observable<any>;
  @ViewChild("divBoard") divBoard!: ElementRef;
  widgetPanelHeight: number = window.innerHeight - 30;
  // test
  state = '';
  position = '';
  widgetDiv: any;
  subscription1: Subscription | undefined;
  getElement() {
    if (this.widgetIndex)
      return this.widgetIndex.nativeElement;
  }

  ngAfterViewInit() {
   
  }
  ngDoCheck(): void {
    
  }
  

  ngOnInit(): void {
    this.getSession();

    this.getAll();
    this.subscription1 = this.service.currWidgetRequest.subscribe(data => {
      if (data) {
        console.log('currWidgetRequest', data)
        this.updateWidget(data);

      }
    })
  }

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

  getMappedChartRequest() {
    const params = { IS_DRAGGED: 1, COMPANY_ID: this.VALUE.COMPANY_ID };
    this.dataService.getAllChartRequests(params).subscribe(res => {
      if (res) {

        this.doneList = res.data.map((el: chartItem) => {
          return el;
        });

        this.draggedWidget = res.data.length > 0 ? this.doneList.map(x => {
          return x.PID.toString();
        }) : ['0'];
        of(this.doneList).subscribe((res: any) => {
          // console.log(res)
          res.dragDisabled = false;
          this.dragDisabledArr = res;
        })

        this.draggedWidget$ = this.doneList.map((item: any) => {

          item.dragDisabled = false;

          return item;
        });
        this.getAllChartRequest();
      }

    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(WidgetComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: this.toEditRequest ? this.toEditRequest : null
    });
    dialogRef.afterClosed().subscribe(result => {
      // call all charts      
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
    this.dataService.getAllChartRequests({ IS_DRAGGED: 0, COMPANY_ID: this.VALUE.COMPANY_ID }).subscribe(res => {
      this.dataSource = res.data.map((el: chartItem) => {
        return el;
      });
      this.overAllCharts = this.dataSource.concat(this.doneList);
      this.undraggedWidget = res.data.map((itm: chartItem) => {
        return itm.PID.toString();

      })
      of(res.data).subscribe(z => {
        this.undraggedWidget$ = z;
      })
      // console.log(this.undraggedWidget$)
      this.loader = false;
    })
  }
  onDrop2(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    const data = event.item.data;
    if (data) {
      this.changeStatus(data.PID)
    }
  }
  // dragStart(event:CdkDragStart<any[]>){
  //   console.log('event',event)
  // }
  dragStarted(event: CdkDragStart) {
    console.log(event)

    this.state = 'dragStarted';
  }

  dragEnded(event: CdkDragEnd, List: any) {
    console.log(event)
    const itemRect = event.source.element.nativeElement.getBoundingClientRect();
    const top = Math.max(0, itemRect.top + event.distance.y - this.divBoard.nativeElement.getBoundingClientRect().top);
    const left = Math.max(0, itemRect.left + event.distance.x - this.divBoard.nativeElement.getBoundingClientRect().left);
    // console.log('top', top, 'left', left)
    const index = event.source.dropContainer.data.findIndex((obj: any) => obj.PID == List.PID);
    // console.log(event.source.dropContainer.data[index])
    const currData = event.source.dropContainer.data[index];
    const prop = JSON.parse(currData.WIDGET_SIZE)
    prop.top = top;
    prop.left = left;
    currData.WIDGET_SIZE = JSON.stringify(prop);
    event.source.dropContainer.data[index].WIDGET_SIZE = JSON.stringify(prop);
    this.state = 'dragEnded';
    currData.LOADED = false;
    // this.updateDraggedArr(currData);
    // this.updateWidget(currData);    // update api
    // let windex = this.draggedWidget$.findIndex(a => {
    //   return a.PID == currData.PID;
    // })
    // if (windex != -1) {
    //   currData.LOADED=false;
    console.log('currData', currData)
    //   this.draggedWidget$[windex] = currData;
    // // this.service.setPosition({
    // //   'top': top, 'left': left, PID: currData.PID
    // // })
    // const orgSize = JSON.parse(currData.WIDGET_SIZE)

    // const newSize = {
    //   width: orgSize.width,
    //   height: orgSize.height,
    //   top: top,
    //   left: left
    // }
    // currData.WIDGET_SIZE = JSON.stringify(newSize);
    // // console.log('this.draggedWidget$', this.draggedWidget$)
    // if (currData) {
    //   currData.LOADED = false;
    //   this.updateWidget(currData)
    // }
    // }

  }
  dragMoved(event: CdkDragMove, List: any) {
    console.log(event)
    this.position = `> Position X: ${event.pointerPosition.x} - Y: ${event.pointerPosition.y}`;
    // console.log(this.position)
    // find index
    const itemRect = event.source.element.nativeElement.getBoundingClientRect();
    const top = Math.max(
      0,
      itemRect.top +
      event.distance.y -
      this.divBoard.nativeElement.getBoundingClientRect().top
    );
    const left = Math.max(
      0,
      itemRect.left +
      event.distance.x -
      this.divBoard.nativeElement.getBoundingClientRect().left
    );


    console.log('top', top, 'left', left)
    const index = event.source.dropContainer.data.findIndex((obj: any) => obj.PID == List.PID);
    // console.log(event.source.dropContainer.data[index])
    const currData = event.source.dropContainer.data[index];
    const prop = JSON.parse(currData.WIDGET_SIZE)
    prop.top = top;
    prop.left = left;
    currData.WIDGET_SIZE = JSON.stringify(prop);
    // this.service.setPosition({
    //   'top': top, 'left': left, PID: currData.PID
    // })
    if (currData) {

      currData.LOADED = false;
      this.updateDraggedArr(currData);
      console.log('currData', currData)

      //  update on api
      // this.updateWidget(currData)
    }
  }
  drop(event: CdkDragDrop<any[]>) {
    const itemRect = event.item.element.nativeElement.getBoundingClientRect();
    const top = Math.max(
      0,
      itemRect.top +
      event.distance.y -
      this.divBoard.nativeElement.getBoundingClientRect().top
    );
    const left = Math.max(
      0,
      itemRect.left +
      event.distance.x -
      this.divBoard.nativeElement.getBoundingClientRect().left
    );

    const isWithinSameContainer = event.previousContainer === event.container;

    let toIndex = event.currentIndex;
    if (event.container.sortingDisabled) {
      const arr = event.container.data.sort((a, b) => a.top - b.top);
      const targetIndex = arr.findIndex(item => item.top > top);

      toIndex =
        targetIndex === -1
          ? isWithinSameContainer
            ? arr.length - 1
            : arr.length
          : targetIndex;
    }

    // const item = event.previousContainer.data[event.previousIndex];
    // // console.log('item',item)
    // item.top = top;
    // item.left = left;

    if (isWithinSameContainer) {
      moveItemInArray(event.container.data, event.previousIndex, toIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        toIndex
      );
    }
    // console.log('top',top,'left',left)
    // this.behavSubject.setPosition({
    //   'top':top,'left':left
    // })
    // const data = event;
    // // console.log(data)
    // const prop = JSON.parse(item.WIDGET_SIZE)
    // prop.top=top;
    // prop.left=left;
    // item.WIDGET_SIZE=JSON.stringify(prop)
  }
  onDrop(event: CdkDragDrop<any[]>) {
    // console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.dragDisabledArr.push({ dragDisabled: false })
    const data = event.item.data;
    // console.log(data)

    if (data) {
      this.changeStatus(data.PID)
    }

  }
  async changeStatus(pid: number) {
    // const data = await this.getRequestDetails(pid, 'json');
    let params = {
      IS_DRAGGED: 1,
      PID: pid
    }
    // console.log(data)
    this.dataService.chartRequestChangeStatus(params).subscribe(async res => {
      this.getMappedChartRequest();

    })
  }

  removeRequest(item: any) {
    this.dataService.deleteChartRequests(item).subscribe(res => {
      this.ngOnInit();
    })
  }
  getRequestDetails(PID: any, val: string) {
    if (PID) {
      // this.WIDGETREQUEST$=
      const value = this.overAllCharts.filter((obj: chartItem) => {

        return obj.PID == parseInt(PID);
      }).map((result: any) => {
        result.dragDisabled = false;
        return result;
      })
      if (value[0] && val == 'n') {
        return value[0].WIDGET_TYPE;
      }
      else if (value[0] && val == 'd') {
        return value[0].WIDGET_DATA;
      } else if (value[0] && val == 'json') {

        return value[0];
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

  saveWidget(data: any) {
    if (data) {
      console.log('update', data)

      // const session = this.dataService.getSessionData();
      // data.CREATED_BY = session.PID;

      // data.SQL_QUERY = 'sql';

      console.log('save params ', data)
      this.dataService.addChartRequest(data).subscribe(res => {
        let index = this.draggedWidget$.findIndex(object => {
          return object.PID == data.PID;
        })
        if (index != -1) {
          this.draggedWidget$[index] = data;
        }
        // this.openSnackBar();
        // recall only dragged requests
        // this.getMappedChartRequest();


      })
    }
  }

  updateWidget(data: any) {

    console.log('upt', data.LOADED)

    this.dataService.addChartRequest(data).subscribe(res => {
      console.log()
      this.openSnackBar();
      this.getMappedChartRequest()
      // this.updateDraggedArr(data);
      // let index = this.draggedWidget$.findIndex(object => {
      //   return object.PID == data.PID;
      // })
      // if (index != -1) {
      //   this.draggedWidget$[index] = data;
      // }
    })
  }
  updateDraggedArr(data: any) {
    let index = this.draggedWidget$.findIndex(object => {
      return object.PID == data.PID;
    })
    if (index != -1) {
      this.draggedWidget$[index] = data;
    }
  }
  widgetRemoved(data: any) {
    if (data) {
      // console.log(data)
      this.openSnackBar();

    }
  }
  openSnackBar() {
    this._snackBar.openFromComponent(TooltipComponent, {
      duration: 5 * 1000,
    });
  }

  expandLayout() {

    this.widgetPanelHeight = this.widgetPanelHeight + 100;
    const session = this.dataService.getSessionData();

    const params = {
      HEIGHT: this.widgetPanelHeight,
      COMPANY_ID: session.COMPANY_ID, PID: ''

    }
    this.dataService.settingWidgetLayout(params).subscribe(res => res);
  }
  minLayout() {

    this.widgetPanelHeight = this.widgetPanelHeight - 100;
    this.dataService.settingWidgetLayout({ HEIGHT: this.widgetPanelHeight }).subscribe(res => res);

  }
  companiesList: any = [];
  async getAll() {
    const session = await this.dataService.getSessionData();
    if (session && session.COMPANY_TYPE == 'CORP') {


      this.dataService.getAllCompanies().subscribe(res => {
        this.companiesList = res.data;
        this.loader = false;
        if (res.data.length > 0) {
          if (session.ROLE != 'ADMIN') {
            const val = res.data.filter((z: any) => z.COMPANY_TYPE == session.COMPANY_TYPE);
            console.log(val)
            this.newForm.patchValue({
              COMPANY_ID: val[0] ? val[0].PID : ''
            })
            this.getLayoutHeight()
          }
        }

      })
    } else {
      let params = { COMPANY_TYPE: session.COMPANY_TYPE };
      this.dataService.getAllCompanyTypes(params).subscribe(res => {
        this.companiesList = res.data;
        // console.log(res)
        const val = res.data.filter((z: any) => z.COMPANY_TYPE == session.COMPANY_TYPE);
        this.newForm.patchValue({
          COMPANY_ID: val[0] ? val[0].PID : ''
        })
        this.getLayoutHeight()

      })

    }

  }
  getRequest() {
    this.getLayoutHeight()
  }
  get VALUE() {
    return this.newForm.value;
  }
  getLayoutHeight() {
    this.loader = true;
    // console.log(this.VALUE)
    this.dataService.getWidgetlayout(this.VALUE).subscribe(res => {
      console.log(res)
      this.widgetPanelHeight = res.data && res.data.HEIGHT ? res.data.HEIGHT : 550;
      this.getMappedChartRequest();
    });
  }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe();
  }
}
