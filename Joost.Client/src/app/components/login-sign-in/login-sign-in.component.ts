import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from "../../services/login.service";
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from '@angular/router';
import { HttpErrorResponse } from "@angular/common/http";



@Component({
  selector: 'app-login-sign-in',
  templateUrl: './login-sign-in.component.html',
  styleUrls: ['./login-sign-in.component.scss']
})
export class LoginSignInComponent implements OnInit {
  email: string;
  password: string;
  errorResponse:HttpErrorResponse ;
  isErrorFromServer:boolean = false;
  isFormChecked:boolean = false;
  passwordError:boolean = false;
  loginError:boolean = false;

  //showing loading progressbar
  @Output() 
  loadEvent = new EventEmitter<boolean>();
  constructor(private authService: AuthenticationService, private router: Router) { 
    this.authService.errorEvent.subscribe(data=> 
      {
        this.errorResponse = data;
        this.isErrorFromServer = true;
    });
  }

  ngOnInit() {
  }
  focusPasswordInput(){
    this.isErrorFromServer = false;
    if (this.passwordError) {
      this.passwordError = false;
    }
  }
  focusLoginInput(){
    this.isErrorFromServer = false;
    if (this.loginError) {
      this.loginError = false;
    }
  }
  logIn(form) {
    this.isFormChecked = false;
    if (form.invalid) {
      if (form.form.controls.password.valid==false) {
        this.isFormChecked = true;
        this.passwordError = true;
      }
      if (form.form.controls.login.valid==false) {
        this.isFormChecked = true;
        this.loginError = true;
      }
      return;
    }
    this.errorResponse = null;
    this.loadEvent.emit(false);
    this.authService.login(this.email, this.password).add(
        data => {
        console.log("1) " + localStorage.getItem("joostUserAccessToken"));
        if (!this.errorResponse) {
            this.router.navigate(['menu/user-editing']);
        }
        this.loadEvent.emit(true);
      });
    };
  }
