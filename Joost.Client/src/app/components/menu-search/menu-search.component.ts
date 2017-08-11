import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user-service/user.service';

@Component({
  selector: 'app-menu-search',
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.scss']
})
export class MenuSearchComponent implements OnInit {

    private result:any;
	private searchString:string;
	private  userId:number = 1;
	constructor(private userService: UserService) { }

	ngOnInit() {
	}
	search(){
		this.result =null;
		this.userService.searchResult(this.searchString).subscribe(data => this.result = data);
	}
	addToContact(contactId:number){
		// this.userService.addContact(this.userId,contactId);
		// this.search();
	}
}
