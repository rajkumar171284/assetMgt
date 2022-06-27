import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
// import { AuthService } from '../../services/auth.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { __addAssetDevice } from '../../myclass';
import { interval } from 'rxjs';
@Component({
  selector: 'app-guage',
  templateUrl: './guage.component.html',
  styleUrls: ['./guage.component.scss']
})
export class GuageComponent implements OnInit, OnChanges {
  @Input() name: any;
  graph1: any = {};
  public myGraph: any;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.name)
    if (this.name) {
      this.myGraph=this.name;
    }
    // this.generateChart(this.name)

  }

  generateChart(array: any) {
    let tot = 0;
    for (let arr of this.myGraph) {

      var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: tot + arr.VALUE.activePower,
          title: { text: arr.DEVICE_ID },
          type: "indicator",
          mode: "gauge+number"
        },
        
      ];
      arr.data = data;
      arr.layout = { width: 300, height: 230, margin: { t: 0, b: 0 } };

    }
  }
  ngOnInit(): void {
    

  }

}
