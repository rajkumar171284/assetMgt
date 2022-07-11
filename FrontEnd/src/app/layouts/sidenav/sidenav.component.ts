import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],providers:[ThemeService]
})
export class SidenavComponent implements OnInit {
  isDarkTheme: Observable<boolean>|undefined;
  options: FormGroup;
  session:any;
  constructor(fb: FormBuilder, private router: Router,private themeService: ThemeService) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 0,
    });
  }
  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    const session=JSON.parse(JSON.stringify(sessionStorage.getItem('session')));
    this.session=JSON.parse(session);
    console.log(this.session.LOGIN_NAME)
  }
  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  logOut() {
    sessionStorage.clear();
    sessionStorage.removeItem('session');
    this.router.navigate(['login'])
  }

}
