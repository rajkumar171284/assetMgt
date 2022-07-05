import { Directive,Input,ElementRef,OnInit,TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appToHide]'
})
export class ToHideDirective {

  constructor(private elementRef: ElementRef) { 
     
    }
    @Input()
    set appToHide(val:boolean){      
      if(val){        

        this.elementRef.nativeElement.style.display='block';
      } else {        
   
        this.elementRef.nativeElement.style.display='none';
      }
    }
}
