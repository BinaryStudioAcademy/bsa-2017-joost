import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';

import { ContactService } from "../../services/contact.service";

import { UserSearch } from "../../models/user-search";
import { UserNetState } from "../../models/user-netstate";
import { UserState } from "../../models/user-detail";
import { Contact,ContactState} from "../../models/contact";
import { UserContact} from "../../models/user-contact";
import { ChatHubService } from "../../services/chat-hub.service";
import { Subscription } from "rxjs/Rx";
import { EventEmitterService } from "../../services/event-emitter.service";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-menu-users',
  templateUrl: './menu-users.component.html',
  styleUrls: ['./menu-users.component.scss']
})
export class MenuUsersComponent implements OnInit, OnDestroy, AfterViewChecked  {

	private result:UserContact[];
	private searchContact:UserContact[];
	private searchString:string;
	private addContactSubscription: Subscription;
	private confirmContactSubscription: Subscription;
	private canceledContactSubscription: Subscription;	
	private newContactSubscription: Subscription;
	private userOnlineSubscription: Subscription;
	private userOfflineSubscription: Subscription;
    private userChangeStateSubscription: Subscription; 
    private addNewContactSubscription: Subscription;
    private confirmContactEmitSubscription: Subscription;

	
	constructor(
		private router: Router,
        private contactService: ContactService,
        private eventEmitterService: EventEmitterService,
		private chatHubService: ChatHubService
		) { }

	ngOnInit() {
		this.contactService.getAllContacts().subscribe(
			data=> {
				this.result = data;
			    for (var i = this.result.length - 1; i >= 0; i--) {
			      if (!this.result[i].IsOnline) {
			        this.result[i].UserState = UserState.Offline;
			      }
			    }
			    this.searchContact = this.result;
			},
			async err => {
				await this.contactService.handleTokenErrorIfExist(err).then(ok => {
					if (ok) { 
					    this.contactService.getAllContacts().subscribe(data => {
						    this.result = data;
						    for (var i = this.result.length - 1; i >= 0; i--) {
						      if (!this.result[i].IsOnline) {
						        this.result[i].UserState = UserState.Offline;
						      }
						    }
						    this.searchContact = this.result;
					    });
				    }
				});
			}
		);
		
		this.contactService.changeContact.subscribe(
		user => {
			if (user) {
				let contact = this.result.filter(t=>t.Id==user.Id)[0];
				if (contact!==undefined) {
					contact.State = user.State;
				}
				else{
					if (user.State==ContactState.Decline) {
						this.result.splice(this.result.indexOf(user), 1);
					}
					else if (user.State==ContactState.Accept){
						this.result.push(user);
					}
				}
				this.result.sort(this.compareUserContact);
			}
		},
	    async err => {
			await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
					this.contactService.changeContact.subscribe(user => {
					    if (user) {
						    let contact = this.result.filter(t=>t.Id==user.Id)[0];
						    if (contact!==undefined) {
						    	contact.State = user.State;
						    }
						    else{
						    	if (user.State==ContactState.Decline) {
						    		this.result.splice(this.result.indexOf(user), 1);
						    	}
						    	else if (user.State==ContactState.Accept){
						    		this.result.push(user);
						    	}
						    }
						    this.result.sort(this.compareUserContact);
					    }
				    });
			    }
			});
		});

		this.addContactSubscription = this.chatHubService.onAddContactEvent.subscribe((userContact: UserContact) => {
            debugger;
			this.result.push(userContact);
			this.searchContact = this.result;
		});
		this.userOnlineSubscription = this.chatHubService.onNewUserConnectedEvent.subscribe( (user:UserNetState)=> {
		  this.onUserStateChange(user);
		});
		this.userOfflineSubscription = this.chatHubService.onUserDisconnectedEvent.subscribe( (user:UserNetState)=> {
		  this.onUserStateChange(user);
		});
		this.userChangeStateSubscription = this.chatHubService.onUserStateChangeEvent.subscribe((user:UserNetState)=> {
		  this.onUserStateChange(user);
		});
		this.confirmContactSubscription = this.chatHubService.onConfirmContactEvent.subscribe((userContact: UserContact) => {
            this.searchContact.find(c => c.Id == userContact.Id).State = userContact.State;
		});
        this.canceledContactSubscription = this.chatHubService.onCanceledContactEvent.subscribe((userContact: UserContact) => {
            let index = this.searchContact.findIndex(c => c.Id == userContact.Id);
            this.searchContact.splice(index, 1);
        });
        this.addNewContactSubscription = this.eventEmitterService.addNewContact.subscribe(data => {
            this.searchContact.push(data);
        });
        this.confirmContactEmitSubscription = this.eventEmitterService.confirmContact.subscribe(data => {
            this.searchContact.push(data);
        });
	}
	onUserStateChange(user:UserNetState){
	  if (this.result) {
	    let userFromNewContact = this.result.filter(t=>t.Id == user.Id)[0];
	     if (userFromNewContact) {
	      userFromNewContact.UserState = user.IsOnline ? user.State : UserState.Offline;
	     }
	  }
	  this.searchContact = this.result;
	}
	ngOnDestroy() {
		this.addContactSubscription.unsubscribe();
		this.confirmContactSubscription.unsubscribe();
		this.canceledContactSubscription.unsubscribe();		
        this.addNewContactSubscription.unsubscribe();		
    }

	ngAfterViewChecked(): void {
		if($("#message-panel").length > 0)
		{
			let height = $("#message-panel")[0].offsetHeight;
			if($(".menu-user-form").length > 0){
				$(".menu-user-form")[0].style.maxHeight = height - 10 + 'px';
			}
		}
	  }

    private checkSentInvitation() {
        if (this.searchContact && this.searchContact.length > 0) {
            return this.searchContact.filter(item => this.isSentContact(item.Id)).length > 0;
        }
        return false;
    }

    private checkContacts() {
        if (this.searchContact && this.searchContact.length > 0) {
            return this.searchContact.filter(item => this.isAcceptContact(item.Id)).length > 0;
        }
        return false;
    }

	search(){
		this.searchContact = this.result;
		if (this.searchString!=="") {
			this.searchContact = this.result.filter(t=>t.Name.toLowerCase().includes(this.searchString.toLowerCase()));
		}
	}
	goToConfirm(id:number){
		if (this.isNewContact(id) || this.isDeclineContact(id) || this.isCanceledContact(id)) {
			this.contactService.changeContactIdNotify(id);
			this.router.navigate(['menu/add-contact']);
		}
	}
	compareUserContact(a:UserContact,b:UserContact):number{
		if (a.State < b.State) {
		  return -1;
		}
		if (a.State > b.State) {
		  return 1;
		}
		return 0;
	}
	isNewContact(id:number):boolean{
		return this.result.filter(t=>t.Id==id)[0].State===ContactState.New;
    }
    isSentContact(id: number): boolean {
        return this.result.filter(t => t.Id == id)[0].State === ContactState.Sent;
    }
    isAcceptContact(id: number): boolean {
        return this.result.filter(t => t.Id == id)[0].State === ContactState.Accept;
    }
	isDeclineContact(id:number):boolean{
		return this.result.filter(t=>t.Id==id)[0].State===ContactState.Decline;
    }
    isCanceledContact(id: number): boolean {
        return this.result.filter(t => t.Id == id)[0].State === ContactState.Canceled;
    }
	ContactStatus(id:number):string{
		let state =  this.result.filter(t=>t.Id==id)[0];
		if (state) {
			switch (state.State) {
				case ContactState.New:
					return "new_releases";
				case ContactState.Sent:
                    return "person_add";
                case ContactState.Decline:
                    return "cancel";
                case ContactState.Canceled:
                    return "clear";
		    	default:
		    		return "";
		    }
		}
    }

    private navigateToMessages(userId: number) {
        this.router.navigate(["/menu/messages", "user", userId]);
    }

    private goToUserDetail(userId: number): void {
        this.router.navigate(['menu/user-details', userId], { skipLocationChange: true });
    }


}
