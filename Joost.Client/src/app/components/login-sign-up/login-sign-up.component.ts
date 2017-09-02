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
  private emailFormControl = new FormControl('', [Validators.required]);

  //showing loading progressbar
  @Output() 
  loadEvent = new EventEmitter<boolean>();
  userIsEmpty: boolean = true;
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

  registrate(): void {
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
      let userIsEmpty = this.userService.checkUserForUniqueness(email).subscribe(response => {
          if (response) {
              this.userIsEmpty = true;
              return;
          }
          this.userIsEmpty = false;
          return;
      });
  }
}
