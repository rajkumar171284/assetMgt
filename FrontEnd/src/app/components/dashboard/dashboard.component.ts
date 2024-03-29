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
import { BehaviorSubject } from 'rxjs';
import { PushNotificationService } from 'ng-push-notification';
// import {SwPush} from '@angular/service-worker';

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
  styleUrls: ['./dashboard.component.scss'],
  // providers:[PushNotificationService]
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
  constructor(private pushNotification: PushNotificationService, private fb: FormBuilder, public service: XAxisService, private _snackBar: MatSnackBar, public dialog: MatDialog, public dataService: AuthService, private ref: ChangeDetectorRef) {
    this.newForm = this.fb.group({
      PID: [''],
      COMPANY_ID: ['', Validators.required]

    })

  }
  dataSource: chartItem[] = [];
  doneList: chartItem[] = []
  overAllCharts: any = [];
  // undraggedWidget: any[] = ['0'];
  draggedWidget: any[] = ['0'];
  draggedWidget$: _widgetRequest[] = [];

  draggedObervable$!: Observable<any[]>;
  undraggedObervable$!: Observable<any[]>;

  newOberver$ = new BehaviorSubject('');
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
  widgetPanelDetails: any = {};
  widgetPanelHeight: number = window.innerHeight - 30;
  // test
  state = '';
  position = '';
  widgetDiv: any;
  subscription1: Subscription | undefined;
  subscription2: Subscription | undefined;
  getElement() {
    if (this.widgetIndex)
      return this.widgetIndex.nativeElement;
  }

  ngAfterViewInit() {

  }
  ngDoCheck(): void {

  }


  ngOnInit(): void {
    // this.showPush();
    this.getSession();

    this.getAll();
    this.subscription1 = this.service.currWidgetRequest.subscribe(data => {
      if (data) {
        // console.log('currWidgetRequest', data)
        this.updateWidget(data);

      }
    })
    // get removal confirmation
    this.subscription2 = this.service.removedWidgetRequest.subscribe((data: any) => {
      // console.log('removedWidgetRequest', data)
      if (data) {
        // reload 
        this.loader = true;
        if (data.isRemoved && data.row.IS_DRAGGED == 1) {
          this.splicedraggedWidget(data.row.PID);


        } else if (data.isRemoved && data.row.IS_DRAGGED == 0) {
          //right panel-not dragged
          this.spliceUndraggedWidget(data.row.PID);

        }

      }

    })
  }
  splicedraggedWidget(PID: number) {
    const index = this.draggedWidget$.map(x => x.PID).indexOf(PID)
    if (index != -1) {
      this.draggedWidget$.splice(index, 1);
      this.loader = false;
    }
  }
  spliceUndraggedWidget(PID: number) {
    const index = this.undraggedWidget$.map(x => x.PID).indexOf(PID)
    // console.log(index)
    if (index != -1) {
      this.undraggedWidget$.splice(index, 1);
      this.loader = false;

    }
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
    const session = this.dataService.getSessionData();
    const params = { IS_DRAGGED: 1, COMPANY_ID: session.COMPANY_ID };
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

          item.dragDisabled = true;

          return item;
        });
        console.log('draggedWidget', this.draggedWidget$)
        this.loader = false;
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
      this.getAllChartRequest();

    });
  }
  async editRequest(data: any) {

    this.toEditRequest = data;
    this.openDialog();
  }

  async getAllChartRequest() {
    const session = await this.dataService.getSessionData();
    const params = { IS_DRAGGED: 0, COMPANY_ID: session.COMPANY_ID };
    this.undraggedObervable$ = this.dataService.getAllChartRequests(params);
    // console.log('undraggedObervable', this.undraggedObervable$)
    this.dataService.getAllChartRequests(params).subscribe(res => {
      this.dataSource = res.data.map((el: chartItem) => {
        return el;
      });
      this.overAllCharts = this.dataSource.concat(this.doneList);
      this.undraggedObervable$.subscribe((z: any) => {
        this.undraggedWidget$ = z.data;
      })
      // console.log(this.undraggedWidget$)
      this.getMappedChartRequest();
      // 
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
    // currData.LOADED = false;
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

      // currData.LOADED = false;
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
  onDrop(event: CdkDragDrop<any>) {
    // console.log(event)
    if (event.previousContainer === event.container) {
      console.log('1')
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log('2')

    }
    const data = event.item.data;
    console.log(data)

    if (data) {
      this.changeStatus(data)
    }

  }
  async changeStatus(data: any) {
    let params = {
      IS_DRAGGED: 1,
      PID: data.PID
    }
    // console.log(data)
    this.dataService.chartRequestChangeStatus(params).subscribe(res => {
      if (res && res.status == 200) {
        // success
        // then remove from undragged array
        data.IS_DRAGGED = 1;
        this.spliceUndraggedWidget(data.PID);
        // push into dragged 
        this.draggedWidget$.push(data);

      }

    })
  }

  removeRequest(item: any) {
    this.dataService.deleteChartRequests(item).subscribe(res => {
      this.ngOnInit();
    })
  }
  getRequestDetails(PID: any, val: string) {
    if (PID) {

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
      // console.log('update', data)

      // console.log('save params ', data)
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

    // console.log('upt', data.LOADED)

    this.dataService.addChartRequest(data).subscribe(res => {

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
    console.log(data)
    if (data) {
      // console.log(data)
      this.openSnackBar();
      this.getMappedChartRequest();

    }
  }
  openSnackBar() {
    this._snackBar.openFromComponent(TooltipComponent, {
      duration: 5 * 1000,
    });
  }

  expandLayout(type: string) {
    let height: number = 100;
    if (type == 'add') {
      this.widgetPanelHeight = this.widgetPanelHeight + height;
    } else {
      this.widgetPanelHeight = this.widgetPanelHeight - height;
    }

    const session = this.dataService.getSessionData();

    const params = {
      HEIGHT: this.widgetPanelHeight,
      COMPANY_ID: session.COMPANY_ID, PID: this.widgetPanelDetails && this.widgetPanelDetails.PID ? this.widgetPanelDetails.PID : ''

    }
    this.dataService.settingWidgetLayout(params).subscribe(res => res);
  }
  
  companiesList: any = [];
  showEmptyPanel: boolean = false;
  getAll() {
    const session = this.dataService.getSessionData();
    if (!this.dataService.isClientAccess()) {
      // corp company types

      this.dataService.getAllCompanies().subscribe(res => {
        this.companiesList = res.data;
        this.loader = false;
        this.newForm.patchValue({
          COMPANY_ID: session.COMPANY_ID
        })
        this.getLayoutHeight()

      })
    } else {
      // CLIENT
      let params = { COMPANY_TYPE: session.COMPANY_TYPE };
      this.dataService.getAllCompanyTypes(params).subscribe(res => {
        this.companiesList = res.data;
        // console.log(res)
        this.newForm.patchValue({
          COMPANY_ID: session.COMPANY_ID
        })
        this.getLayoutHeight()

      })

    }

  }

  get VALUE() {
    return this.newForm.value;
  }
  getLayoutHeight() {
    this.loader = true;
    // console.log(this.VALUE)
    this.dataService.getWidgetlayout(this.VALUE).subscribe(res => {
      // console.log(res)
      this.widgetPanelDetails = res.data;
      this.widgetPanelHeight = res.data && res.data.HEIGHT ? res.data.HEIGHT : 550;
      this.getAllChartRequest();
    });
  }
  // showPush() {
  //   this.pushNotification.show(
  //     'Show me that message!',
  //     {/* any settings, e.g. icon */ },
  //     6000, // close delay.
  //   );
  //   // Or simply this:
  //   this.pushNotification.show('And that too!');
  // }

  async showAnotherPush() {
    const notification = await this.pushNotification.show('Returns promise with Notification object.');
    setTimeout(() => notification.close(), 1000);
  }
  ngOnDestroy(): void {
    this.subscription1?.unsubscribe();
  }
}
