import { Component, Input,OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddUsersComponent } from '../../components/dialogs/add-users/add-users.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnChanges {
  @Input()tabIndex:any;
  dataSource = [];
  displayedColumns: string[] = [
    "PID", "FIRST_NAME","LAST_NAME","LOGIN_NAME","ROLE","WIDGETS_RIGHTS", "actions"]
  constructor(private dataService: AuthService, public dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('getAllUsers')

    this.getAllUsers();
 
  }

  async getAllUsers() {
    const session = await this.dataService.getSessionData();
    let params = { COMPANY_ID: session.COMPANY_ID };
    this.dataService.getAllUsersByCID(params).subscribe(res => {
      this.dataSource = res.data;
    })
  }

  editItem(item: any) {
    const ref=this.dialog.open(AddUsersComponent, {
      width: '800px',
      data: item
    });
    ref.afterClosed().subscribe(result => {
    this.getAllUsers();
    });
  }
  removeItem(item: any) {
    this.dataService.deleteConn(item).subscribe(res => {
      this.getAllUsers();
    });

  }

}
