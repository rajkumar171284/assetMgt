import { Component, Input,OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCompanyComponent} from '../../components/dialogs/add-company/add-company.component';
import { AddUsersComponent } from '../../components/dialogs/add-users/add-users.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnChanges {
  @Input()tabIndex:any;
  @Input()cType:string|undefined;
  @Input() updateData: any;

  dataSource = [];
  displayedColumns: string[] = [
    "PID", "COMPANY_NAME","COMPANY_ADDRESS_LINE1","CREATED_DATE", "STATUS", "actions"];

  constructor(private dataService: AuthService, public dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes)
    if(this.tabIndex==5||this.updateData){
    // console.log('getAllCompanyTypes',this.cType,this.tabIndex)
      
    this.getAll();
    }
 
  }

  async getAll() {
    const session = await this.dataService.getSessionData();
    let params = { COMPANY_TYPE: this.cType };
    this.dataService.getAllCompanyTypes(params).subscribe(res => {
      this.dataSource = res.data;
    })
  }

  editItem(item: any) {
    item.type=this.cType;
    const ref=this.dialog.open(AddCompanyComponent, {
      width: '800px',
      data: item
    });
    ref.afterClosed().subscribe(result => {
    this.getAll();
    });
  }
  removeItem(item: any) {
    this.dataService.deleteCompanyByID(item).subscribe(res => {
      this.getAll();
    });

  }
  addUser(element:any){
    const dialogRef = this.dialog.open(AddUsersComponent, {
      width: '800px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

}
