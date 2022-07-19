import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-widget-dashboard',
  templateUrl: './widget-dashboard.component.html',
  styleUrls: ['./widget-dashboard.component.scss']
})
export class WidgetDashboardComponent implements OnInit {

  constructor() { }
  items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  drop(event: CdkDragDrop<any>) {
    this.items[event.previousContainer.data.index] = event.container.data.item;
    this.items[event.container.data.index] = event.previousContainer.data.item;
  }
  ngOnInit(): void {
  }

}
