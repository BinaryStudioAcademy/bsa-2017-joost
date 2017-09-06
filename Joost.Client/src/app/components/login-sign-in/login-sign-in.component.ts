import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  isError:string = "";

  //showing loading progressbar
  @Output() 
  loadEvent = new EventEmitter<boolean>();
  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  logIn() {
    
    // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if (!re.test(this.email)){
    //   this.isError = "Email is invalid!";
    //   return;
    // }
    // if (this.password.length < 6){
    //   this.isError = "Password length shold be at least 6 symbols!";
    //   return;
    // }
    //this.loadEvent.emit(false);
      this.authService.login(this.email, this.password).add(
          data => {
          console.log("1) " + localStorage.getItem("joostUserAccessToken"));
          this.router.navigate(['menu/user-editing']/*, {skipLocationChange: true}*/);
          this.loadEvent.emit(true);
        });
        /*error =>{
           console.log(error);
           this.isError = "User with this login and password not found!";
           this.loadEvent.emit(true);
         })*/
      };
  }
