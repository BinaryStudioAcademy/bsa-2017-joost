import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  
  //showing loading progressbar
  @Output() 
  loadEvent = new EventEmitter<boolean>();
  constructor(private loginService: LoginService, private router: Router) { }

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
}
