import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  options: FormGroup;
  session:any;
  constructor(fb: FormBuilder, private router: Router) {
    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 0,
    });
  }
  ngOnInit(): void {
    const session=JSON.parse(JSON.stringify(sessionStorage.getItem('session')));
    this.session=JSON.parse(session);
    console.log(this.session.LOGIN_NAME)
  }
  logOut() {
    sessionStorage.clear();
    sessionStorage.removeItem('session');
    this.router.navigate(['login'])
  }

}
