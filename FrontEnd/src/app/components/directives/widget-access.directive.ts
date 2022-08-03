import { Directive,Input,ElementRef,OnInit,TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[appWidgetAccessIf]'
})
export class WidgetAccessDirective implements OnInit {

  constructor(private elementRef: ElementRef,private dataService: AuthService) { 
      // const privilegeRole = sessionStorage.getItem(
      //   session.WIDGETS_RIGHTS
      // );
  
    }
  // constructor(private elementRef: ElementRef,private dataService: AuthService,private templateRef: TemplateRef<any>,
  //   private viewContainer: ViewContainerRef) { 
  //     // const privilegeRole = sessionStorage.getItem(
  //     //   session.WIDGETS_RIGHTS
  //     // );
  
  //   }

    // @Input()
    // set appWidgetAccessIf(val:any){
    //   const session = this.dataService.getSessionData();

    //   if( session.ROLE=== val && session.WIDGETS_RIGHTS === 1) {
    //     console.log(val)

    //     this.viewContainer.createEmbeddedView(this.templateRef);
    //   } else {
    //     console.log(val)
   
    //     this.viewContainer.clear();
    //   }
    // }

  ngOnInit(): void {
    // console.log('appWidgetAccess')
    const session = this.dataService.getSessionData();
    if(session && session.ROLE=='ADMIN' && (session.COMPANY_TYPE=='CORP'||session.COMPANY_TYPE!='CORP')){
      // console.log('session.ROLE',session.ROLE)
      this.elementRef.nativeElement.style.display='block';
      // this.viewContainer.createEmbeddedView(this.templateRef);


    }else{
      // console.log('session.ROLE',session.ROLE)

      this.elementRef.nativeElement.style.display='none';
      // this.viewContainer.clear();
    }
    // console.log('session',session.ROLE)

  }
}
