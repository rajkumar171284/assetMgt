import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class XAxisService {
  private WidthHeight = new BehaviorSubject('Foo message');
  currentWidthHeight = this.WidthHeight.asObservable();

  private position = new BehaviorSubject('');
  currentPosition = this.position.asObservable();


  private totalDevice=new BehaviorSubject('');
  currentDevice = this.totalDevice.asObservable();

  private updatedWidgetRequest=new BehaviorSubject('');
  currWidgetRequest =this.updatedWidgetRequest.asObservable();

  private isWidgetRemoved=new BehaviorSubject('');
  removedWidgetRequest =this.isWidgetRemoved.asObservable();

  private company =new BehaviorSubject('');
  currCompany=this.company.asObservable();

  value = new Subject();
  constructor() { }

  updateCompany(msg:any){
    this.company.next(msg)
  }

  updateWidgetReq(request:any){
  this.updatedWidgetRequest.next(request);
  }
  setPosition(message: any) {
    this.position.next(message)
  }
  sendTotalDevice(message: any) {
    this.totalDevice.next(message)
  }
  changeWidthHeight(message: any) {
    this.WidthHeight.next(message)
  }

  confirmWidgetRemoval(message: any){
    this.isWidgetRemoved.next(message)
  }

  sendValue(data: any) {
    console.log(data)
    this.value.next({ data: data })
  }
  getValue(): Observable<any> {
    return this.value.asObservable()
  }
  clearData() {
    this.value.next({ data: "" });
  }

  getProp(type: string,WIDGET_REQUEST:any) {
    const prop = JSON.parse(WIDGET_REQUEST.WIDGET_SIZE)
    if (type == 'W') {
      return prop.width;
    }
    if (type == 'H') {
      return prop.height
    } else if (type == 't') {
      return prop.top ? prop.top : 0
    } else if (type == 'l') {
      return prop.left ? prop.left : 0
    }
  }
}
