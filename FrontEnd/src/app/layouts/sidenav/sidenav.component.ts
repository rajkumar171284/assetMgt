import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { AddCompanyComponent } from '../../components/dialogs/add-company/add-company.component';
import { MatDialog, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import{AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'], providers: [ThemeService]
})
export class SidenavComponent implements OnInit {
  isDarkTheme: Observable<boolean> | undefined;
  options: FormGroup;
  session: any;
  companyData: any;
  constructor(public auth:AuthService,public dialog: MatDialog, fb: FormBuilder, private router: Router, private themeService: ThemeService) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 0,
    });
  }
  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    const session = JSON.parse(JSON.stringify(sessionStorage.getItem('session')));
    this.session = JSON.parse(session);
    // console.log(this.session.LOGIN_NAME)
    this.getCurrComp();
  }
  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  getCurrComp(){
    const params=this.session;
    this.auth.getCompanyDetails(params).subscribe(res=>{
      console.log(res)
      this.companyData=res.data;
    })
  }
  logOut() {
    sessionStorage.clear();
    sessionStorage.removeItem('session');
    this.router.navigate(['login'])
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      width: '800px',
      data: this.companyData[0]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('afterClosed')


    });

  }

}
