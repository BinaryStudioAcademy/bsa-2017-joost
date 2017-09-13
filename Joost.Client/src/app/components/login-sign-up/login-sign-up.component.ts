import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, NgModel } from '@angular/forms';
import { LoginService } from "../../services/login.service";
import { Login } from "../../models/user-detail";
import { Router } from '@angular/router';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-login-sign-up',
  templateUrl: './login-sign-up.component.html',
  styleUrls: ['./login-sign-up.component.scss']
})
export class LoginSignUpComponent implements OnInit {
  email: string;
  password: string;
  confirmPassword: string;
  isErrorFromServer:boolean = false;
  isFormChecked:boolean = false;
  passwordError:boolean = false;
  loginError:boolean = false;
  passwordConfirmError:boolean = false;
  userIsEmpty:boolean;

  private emailFormControl = new FormControl('', [Validators.required]);

  //showing loading progressbar
  @Output() 
  loadEvent = new EventEmitter<boolean>();
  constructor(private loginService: LoginService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    let self = this;
     var dialog = document.querySelector('.wrapper-modal');
      document.querySelector('.close, .button-close').addEventListener('click', function() {
        dialog.classList.remove("show");
        self.router.navigate(['login']);
        location.reload();
      });
  }
  focusPasswordInput(){
    if (this.passwordError) {
      this.passwordError = false;
    }
  }
  focusLoginInput(){
    if (this.loginError) {
      this.loginError = false;
    }
  }
  focusPasswordConfirmInput(){
    if (this.passwordConfirmError) {
      this.passwordConfirmError = false;
    }
  }
  registrate(form): void {
    this.checkEmailIsEmpty(this.email);
    this.isFormChecked = false;
    console.log(form);
    if (form.invalid) {
      if (form.form.controls.signInEmail.valid==false || !this.userIsEmpty)  {
        this.isFormChecked = true;
        this.loginError = true;
      }
      if (form.form.controls.passwordUser.valid==false) {
        this.isFormChecked = true;
        this.passwordError = true;
        return;
      }
      if (this.password==this.confirmPassword) {
        this.isFormChecked = true;
        this.passwordConfirmError = true;
      }
      return;
    }
      this.loadEvent.emit(false);
      var model: Login = { Email: this.email, Password : this.password };
      this.loginService.addUser(model).subscribe(rez => {
        var dialog = document.querySelector('.wrapper-modal');
        dialog.classList.add("show");
        this.loadEvent.emit(true);
      },
    error => {
      console.log(error);
    });
  }

  checkEmailIsEmpty(email: string): void {
      this.userService.checkUserForUniqueness(email).subscribe(response => {
          if (response) {
              this.userIsEmpty = true;
              return;
          }
          this.userIsEmpty = false;
          console.log(this.userIsEmpty);
          return;
      });
  }
}
