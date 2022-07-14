import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class XAxisService {
  value=new Subject();
  constructor() { }
  
  sendValue(data:any){
    console.log(data)
    this.value.next({data:data})
  }
  getValue():Observable<any>{
    return this.value.asObservable()
  }
  clearData(){
    this.value.next({data:""});
  }
}
