import { Component, OnInit } from '@angular/core';
import { LoginService } from "../../services/login.service";
import { Login } from "../../models/user-detail";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-sign-up',
  templateUrl: './login-sign-up.component.html',
  styleUrls: ['./login-sign-up.component.scss']
})
export class LoginSignUpComponent implements OnInit {
  email: string;
  password: string;
    
  constructor(private loginService: LoginService, private router: Router) { }

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
}
