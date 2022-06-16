import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddUsersComponent } from '../../components/dialogs/add-users/add-users.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnChanges {
  @Input() tabIndex: any;
  dataSource = [];
  displayedColumns: string[] = [
    "PID", "FIRST_NAME", "LAST_NAME", "LOGIN_NAME", "ROLE", "WIDGETS_RIGHTS", "actions"];
  companiesList: any = [];
  newForm: FormGroup;

  constructor(private dataService: AuthService, public dialog: MatDialog, private fb: FormBuilder) {
    this.newForm = this.fb.group({
      COMPANY_ID: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.tabIndex)
    if (this.tabIndex == 0) {
      const session = this.dataService.getSessionData();
      this.newForm.patchValue({
        COMPANY_ID: session.COMPANY_ID
      })
      this.getAllUsers();
    }
  }

  getAllUsers() {
    // const session = await this.dataService.getSessionData();
    let params = { COMPANY_ID: this.newForm.get('COMPANY_ID')?.value };
    this.dataService.getAllUsersByCID(params).subscribe(res => {
      this.dataSource = res.data;
      this.getAllComp();
    })
  }
  async getAllComp() {
    const session = await this.dataService.getSessionData();

    this.dataService.getAllCompanies().subscribe(res => {
      this.companiesList = res.data;
    })
  }
  editItem(item: any) {
    const ref = this.dialog.open(AddUsersComponent, {
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
  getCompanyID() {
    this.getAllUsers();

  }

}
