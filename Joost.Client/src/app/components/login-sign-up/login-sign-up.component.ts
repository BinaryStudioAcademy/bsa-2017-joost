import { Component, OnInit } from '@angular/core';
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
  userIsEmpty: boolean = true;

  constructor(private loginService: LoginService, private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  registrate(): void {
      var model: Login = { Email: this.email, Password : this.password };
      this.loginService.addUser(model).subscribe(rez => {
          this.router.navigate(['/app']);
          location.reload();
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
