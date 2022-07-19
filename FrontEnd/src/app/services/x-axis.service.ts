import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class XAxisService {
  private messageSource = new BehaviorSubject('Foo message');
  currentMessage = this.messageSource.asObservable();

  private position = new BehaviorSubject('');
  currentPosition = this.position.asObservable();


  private totalDevice=new BehaviorSubject('');
  currentDevice = this.totalDevice.asObservable();

  value = new Subject();
  constructor() { }
  setPosition(message: any) {
    this.position.next(message)
  }
  sendTotalDevice(message: any) {
    this.totalDevice.next(message)
  }
  changeMessage(message: any) {
    this.messageSource.next(message)
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
      return prop.width
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
