import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { LoginRoutingModule } from './login/login-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    SigninComponent
  ],
  imports: [
    CommonModule, LoginRoutingModule, SharedModule, MatInputModule, MatButtonModule,
    FormsModule, ReactiveFormsModule, MatFormFieldModule, HttpClientModule
  ]
  ,
  providers: [HttpClient, AuthService]
})
export class LoginModule { }
