import { Component, OnInit } from '@angular/core';
import { Location }                 from '@angular/common';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  constructor(
    private location: Location

  ) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }
}
