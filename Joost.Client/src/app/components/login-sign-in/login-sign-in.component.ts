import { Component, OnInit } from '@angular/core';
import { LoginService } from "../../services/login.service";
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-sign-in',
  templateUrl: './login-sign-in.component.html',
  styleUrls: ['./login-sign-in.component.scss']
})
export class LoginSignInComponent implements OnInit {
  email: string;
  password: string;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  logIn() {
      this.authService.login(this.email, this.password).subscribe(data => {
        this.authService.getUserId().subscribe(id => {
          this.router.navigate(['/menu/user-editing/', id]/*, {skipLocationChange: true}*/);
        })
      });
    // this.router.navigate(['/menu']);
  }
}
