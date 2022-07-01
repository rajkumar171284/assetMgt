import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Config, Data, Layout } from 'plotly.js';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
// import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { __addAssetDevice } from '../../myclass';
import { interval } from 'rxjs';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
@Component({
  selector: 'app-guage',
  templateUrl: './guage.component.html',
  styleUrls: ['./guage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuageComponent implements OnInit, OnChanges {
  @Input() name: any;
  graph1: any = {};
  public myGraph: any = [];
  @Input() selectedDevice: any;
  newForm: FormGroup = this.fb.group({
    DEVICE_ID: [''],
  })
  errMessage:any;
  constructor(private fb: FormBuilder,private ref: ChangeDetectorRef) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.name)
    if (this.name) {
      this.selectedDevice = 0;
      this.newForm.patchValue({
        DEVICE_ID: this.selectedDevice
      })
      this.generateChart(this.name)

    }
    // console.log(this.selectedDevice)

  }

  generateChart(array: any) {

    this.myGraph = [];
    for (let arr of array) {
      let newObj: any = {};
      newObj.DEVICE_ID = arr.DEVICE_ID;
      newObj.units = [];
      for (let item of arr.unitsArr) {
        var data = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: item.totalValue,
            title: { text: item.key },
            type: "indicator",
            mode: "gauge+number"
          },

        ];
        let newItem: any = {}
        newItem.data = data;
        newItem.layout = { width: 300, height: 230, margin: { t: 0, b: 10 } };
        newObj.units.push(newItem)

      }
      this.myGraph.push(newObj)
      console.log(this.myGraph)

    }
    this.ref.detectChanges();
  }
  ngOnInit(): void {

  }
  onDeviceChange() {
    this.selectedDevice = this.newForm.get('DEVICE_ID')?.value;
  }
}
