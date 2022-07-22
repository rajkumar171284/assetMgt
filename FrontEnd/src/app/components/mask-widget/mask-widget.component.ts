import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mask-widget',
  templateUrl: './mask-widget.component.html',
  styleUrls: ['./mask-widget.component.scss']
})
export class MaskWidgetComponent implements OnInit {
@Input('mask')WIDGET_REQUEST:any='';
  constructor() { }

  ngOnInit(): void {
  }

}
