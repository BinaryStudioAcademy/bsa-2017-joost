import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent implements OnInit {
    key: string;

    constructor(private router: Router,
        private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  confirm() {
      debugger;
      this.route.queryParams.subscribe(params => {
          this.key = params['key'];
          this.userService.confirmRegistration(this.key);
      });
      this.router.navigate(['/login']);
  }
}
