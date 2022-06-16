import { Directive,Input,ElementRef,OnInit,TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appAccessrights]'
})
export class AccessrightsDirective {

  constructor(private elementRef: ElementRef,private dataService: AuthService,private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { 
      // const privilegeRole = sessionStorage.getItem(
      //   session.WIDGETS_RIGHTS
      // );
  
    }

    @Input()
    set appAccessrights(val:any){
      const session = this.dataService.getSessionData();

      if(session && session.ROLE=='ADMIN' && session.COMPANY_TYPE=='CORP'){
        console.log(val)

        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        console.log(val)
   
        this.viewContainer.clear();
      }
    }

}
