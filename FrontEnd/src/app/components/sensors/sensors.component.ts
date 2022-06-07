import { Component, OnInit,ViewChild ,ChangeDetectionStrategy,ChangeDetectorRef,OnChanges, SimpleChanges, Input} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddSensorSubcategoryComponent } from '../dialogs/add-sensor-subcategory/add-sensor-subcategory.component';
import { AddSensorComponent } from '../../components/dialogs/add-sensor/add-sensor.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

interface PeriodicElement {
  PID: number;
  NAME: string;
  subCatg: [];
}
@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SensorsComponent implements OnInit ,OnChanges{
  @Input('tabIndex')tabIndex:any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator | null;

  expandedElement: PeriodicElement | null | undefined;
  indexedSensor: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [
    "PID", "NAME"]
  constructor(private dataService: AuthService, public dialog: MatDialog,private ref:ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }
  ngOnInit(): void {
    console.log(this.expandedElement)
    this.getSensors();
  }

  async getSensors() {
    const session = await this.dataService.getSessionData();
    let params = { COMPANY_ID: session.COMPANY_ID };
    this.dataService.getAllSensors(params).subscribe(res => {
      this.ref.detectChanges();
      this.dataSource= new MatTableDataSource(res.data);
      this.dataSource.paginator =this.paginator;
      this.dataSource = res.data.map((el: any, index: number) => {
        el.sno = index + 1;
        return el;
      });

    })
  }

  editItem(e: Event, item: any) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(AddSensorComponent, {
      width: '800px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {

      this.getSensors();
    });

  }
  removeItem(e: Event,item: any) {
    e.stopPropagation();
  }
  isTableExpanded = false;

  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    }
  expandItem(element: any) {
    // console.log(element)
   
    this.expandedElement = this.expandedElement === element ? null : element
    this.indexedSensor = element;
    this.getindexedSensor(this.indexedSensor);
  }
  getindexedSensor(element: any) {
    let params = { SENSOR_TYPE_ID: element.PID };
    this.dataService.getSubSensorCatg(params).subscribe(res => {
      element.subCatg = res.data.map((el: any, index: number) => {
        el.sno = index + 1;
        return el;
      });
      console.log(element)
    })
  }
  addSensorSubCatg(element: any) {
    console.log(element)
    const dialogRef = this.dialog.open(AddSensorSubcategoryComponent, {
      width: '400px',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!

      this.getindexedSensor(this.indexedSensor)
    });
  }

}
