import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ){}
  ngOnInit(): void {
    if(this.authService.isUserLogined()) {
          this.router.navigate(['menu'], { skipLocationChange: true });
    }
    else if (window.location.pathname.search("confirm-registration") != -1){
        this.router.navigate(['confirm-registration', window.location.search.split("key=")[1]]);
    }
    else {
      this.router.navigate(['login'],  { skipLocationChange: true });
    }
    
  }
}
