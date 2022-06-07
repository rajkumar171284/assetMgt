import { Component,Input, OnInit,OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class HighlightsComponent implements OnChanges {
  @Input()WIDGET_REQUEST:any;
  constructor(private dataService: AuthService) { }

  ngOnInit(): void {

    // this.dataService.getContineo().subscribe(res=>{
    //   console.log(res)
    // }) 

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.WIDGET_REQUEST){
      this.getAllMACAddress();
    }
  }

  getAllMACAddress(){
    this.dataService.getMACByConfigID({PID:this.WIDGET_REQUEST.ASSET_CONFIG_ID}).subscribe(res=>{
      console.log('highlights',res)
      if(res && res.data){
        this.WIDGET_REQUEST.MAC_COUNT=res.data.length;
      }
     
    })
  }

}
