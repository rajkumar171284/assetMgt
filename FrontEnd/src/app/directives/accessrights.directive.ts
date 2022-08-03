import { Directive, Input, ElementRef, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appAccessrights]'
})
export class AccessrightsDirective {

  constructor(private elementRef: ElementRef, private dataService: AuthService, private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {


  }

  @Input()
  set appAccessrights(val: any) {
    const session = this.dataService.getSessionData();
    if (val == false) {
      if (session && session.ROLE == 'ADMIN' && (session.COMPANY_TYPE == 'CORP' || session.COMPANY_TYPE != 'CORP')) {
        // corp & clients
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {

        this.viewContainer.clear();
      }
    } else {
      // only corp access
      if (session && session.ROLE == 'ADMIN' && session.COMPANY_TYPE == 'CORP') {

        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {

        this.viewContainer.clear();
      }

    }

  }

}
