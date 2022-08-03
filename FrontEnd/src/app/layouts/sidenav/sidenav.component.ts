import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { AddCompanyComponent } from '../../components/dialogs/add-company/add-company.component';
import { MatDialog, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment';
import { XAxisService } from '../../services/x-axis.service';

interface _companyDetails {
  APP_SOLUTION_NAME: string,
  COMPANY_ADDRESS_LINE1: string,
  COMPANY_ADDRESS_LINE2: string,
  COMPANY_NAME: string,
  COMPANY_TYPE: string,
  CREATED_BY: number,
  LOGO: string,
  PID: number,
  STATUS: boolean
}
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'], providers: [ThemeService]
})
export class SidenavComponent implements OnInit {
  isDarkTheme: Observable<boolean> | undefined;
  companyDetails$!: Observable<_companyDetails>;
  options: FormGroup;
  session: any;
  companyData: any = {};
  public imgUrl: any;

  constructor(public transfer: XAxisService, public auth: AuthService, public dialog: MatDialog, fb: FormBuilder, private router: Router, private themeService: ThemeService) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 22,
    });

  }
  profilePicture: any;

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    const session = JSON.parse(JSON.stringify(sessionStorage.getItem('session')));
    this.session = JSON.parse(session);
    // console.log(this.session.LOGIN_NAME)
    this.transfer.currCompany.subscribe((data: any) => {
      if (data) {
        console.log('comp data', data)
        this.companyData = data;
        this.profilePicture = environment.imgUrl + data.LOGO;
        // this.companyDetails$.subscribe(z=>{
        //   console.log(z)
        // });


      }
    })
    // this.companyDetails$=this.transfer.currCompany.subscribe((data:_companyDetails)=>data)

    this.getCurrComp();
  }
  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  getCurrComp() {
    const params = this.session;
    this.auth.getCompanyDetails(params).subscribe(res => {
      // console.log(res)
      this.companyData = res && res.data[0] ? res.data[0] : null;
      this.imgUrl = environment.imgUrl + res.data[0].LOGO;
      this.profilePicture = environment.imgUrl + res.data[0].LOGO;

    })
    // this.companyDetails$=this.auth.getCompanyDetails(params);
    // console.log(this.companyDetails$)
  }
  logOut() {
    sessionStorage.clear();
    sessionStorage.removeItem('session');
    this.router.navigate(['login'])
  }

  openDialog() {
    if (this.companyData) {
      this.companyData.isProfileChange = true;
    }
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      width: '800px',
      data: this.companyData ? this.companyData : null
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('afterClosed')


    });

  }

}
