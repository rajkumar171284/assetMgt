import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  logForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private dataService: AuthService) {
    this.logForm = this.fb.group({
      LOGIN_NAME: ['', Validators.required],
      PASSWORD: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  logIn() {

    let logged;
    console.log(this.logForm.valid)
    if (this.logForm.valid) {
      logged = 'true';
      this.dataService.authLogin(this.Values).subscribe(res => {
        console.log(res)
        if (res.status == 200 && res.data.length > 0) {

          sessionStorage.setItem('session', JSON.stringify(res.data[0]));
          this.router.navigate(['home/dashboard']);
        }else{
          sessionStorage.clear();
        }

      })



    } else {
      logged = 'false';
      sessionStorage.removeItem('session')
      sessionStorage.clear();

    }


  }
  get Values() {
    return this.logForm.value;
  }

}
