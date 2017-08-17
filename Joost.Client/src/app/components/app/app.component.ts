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
        this.authService.getUserId().subscribe(id => {
          this.router.navigate(['menu'], /*{ skipLocationChange: true }*/)
        })
    }
    else {
      this.router.navigate(['login'],  /*{ skipLocationChange: true }*/);
    }
    
  }
}
