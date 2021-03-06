﻿import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { AccountService } from '../../services/account.service';
import { ContactService } from "../../services/contact.service";
import { AuthenticationService } from '../../services/authentication.service';

import { UserSearch } from "../../models/user-search";
import { Contact,ContactState} from "../../models/contact";
import { UserContact } from "../../models/user-contact";
import { EventEmitterService } from "../../services/event-emitter.service";
import { Subscription } from "rxjs/Rx";
import { ChatHubService } from "../../services/chat-hub.service";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-menu-search',
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.scss']
})
export class MenuSearchComponent implements OnInit, AfterViewChecked {

    private result:UserSearch[];
	private searchString:string;
	private isLoad:boolean = false;
    private contactList: Contact[];
    private confirmContactSubscription: Subscription;
    private canceledContactSubscription: Subscription;

	constructor(
		private accountService: AccountService,
        private authService: AuthenticationService,
        private eventEmitterService: EventEmitterService,
        private chatHubService: ChatHubService,
		private contactService: ContactService
	) { }

	ngOnInit() {
		this.contactService.getContacts().subscribe(data=>this.contactList = data,
			async err => {
                await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
					if (ok) {
                        this.contactService.getContacts().subscribe(data => {                
                            this.contactList = data;
					    });
				    }
                });
            }
		);
		this.contactService.changeContact.subscribe(user=>{
			if (user) {
				let contact = this.contactList.filter(t=>t.ContactId==user.Id)[0];
				if (contact!==undefined) {
					contact.State = user.State;
				}
				else if (user.State==ContactState.Decline) {
					let currUser = this.contactList.filter(t=>t.ContactId==user.Id)[0];
					this.contactList.splice(this.contactList.indexOf(currUser), 1);
				}
				else {
					this.contactList.push(new Contact(user.Id,user.State));
				}
			}
		},
	    async err => {
			await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
				this.contactService.changeContact.subscribe(user => {                
			     	if (user) {
				    		let contact = this.contactList.filter(t=>t.ContactId==user.Id)[0];
				    		if (contact!==undefined) {
				    			contact.State = user.State;
				    		}
				    		else if (user.State==ContactState.Decline) {
			     				let currUser = this.contactList.filter(t=>t.ContactId==user.Id)[0];
			    				this.contactList.splice(this.contactList.indexOf(currUser), 1);
			    			}
			    			else {
			    				this.contactList.push(new Contact(user.Id,user.State));
				    		}
					    }
				    });
			    }
			});
        });
        this.confirmContactSubscription = this.chatHubService.onConfirmContactEvent.subscribe((userContact: UserContact) => {
            this.contactList.find(c => c.ContactId == userContact.Id).State = userContact.State;
        });
        this.canceledContactSubscription = this.chatHubService.onCanceledContactEvent.subscribe((userContact: UserContact) => {
            this.contactList.find(c => c.ContactId == userContact.Id).State = userContact.State;
        });
	}

	ngAfterViewChecked(): void {
		if($("#message-panel").length > 0)
		{
			let height = $("#message-panel")[0].offsetHeight;
			if($(".menu-search-form").length > 0){
				$(".menu-search-form")[0].style.maxHeight = height - 10 + 'px';
			}
		}
	}

	search(){
		this.contactService.getContacts().subscribe(data=>{
			this.contactList= data;
		},
	    async err => {
			await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
				    this.contactService.getContacts().subscribe(data => {                
					    this.contactList = data;
				    });
			    }
			});
		});

		this.isLoad = false;
		if (this.searchString) {
			this.accountService
			.searchResult(this.searchString)
			.subscribe(data =>{
					this.result = data;
					this.isLoad = true;
			},
		    async err => {
                await this.accountService.handleTokenErrorIfExist(err).then(ok => { 
					if (ok) {
                        this.accountService
						.searchResult(this.searchString).subscribe(data => {                
                            this.result = data;
						    this.isLoad = true;
					    });
				    }
                });
			});
			
			if(!this.ContainsCyrillicChar(this.searchString)) { // input in EN
				this.accountService // check in UA layout
				.searchResult(this.ChangeLayout(this.searchString,this.ENtoUAReplacePattern))
				.subscribe(data =>{
					this.result = this.deleteDuplicatedResults(this.result.concat(data));
					this.isLoad = true;					
				},
				async err => {
					await this.accountService.handleTokenErrorIfExist(err).then(ok => { 
						if (ok) {
							this.accountService
							.searchResult(this.ChangeLayout(this.searchString,this.ENtoUAReplacePattern)).subscribe(data => {
								this.result = this.deleteDuplicatedResults(this.result.concat(data));
								this.isLoad = true;
							});
						}
					});
                    });

				this.accountService // check in RU layout
				.searchResult(this.ChangeLayout(this.searchString,this.ENtoRUReplacePattern))
				.subscribe(data =>{
					this.result = this.deleteDuplicatedResults(this.result.concat(data));	
					this.isLoad = true;
				},
				async err => {
					await this.accountService.handleTokenErrorIfExist(err).then(ok => { 
						if (ok) {
							this.accountService
							.searchResult(this.ChangeLayout(this.searchString,this.ENtoRUReplacePattern)).subscribe(data => {                
								this.result = this.deleteDuplicatedResults(this.result.concat(data));
								this.isLoad = true;								
							});
						}
					});
				});

			} else { // input in UA or RU
				this.accountService // check in EN layout
				.searchResult(this.ChangeLayout(this.searchString,this.UAorRUtoENReplacePattern))
				.subscribe(data =>{
					this.result = this.deleteDuplicatedResults(this.result.concat(data));
					this.isLoad = true;													
				},
				async err => {
					await this.accountService.handleTokenErrorIfExist(err).then(ok => { 
						if (ok) {
							this.accountService
							.searchResult(this.ChangeLayout(this.searchString,this.UAorRUtoENReplacePattern)).subscribe(data => {                
								this.result = this.deleteDuplicatedResults(this.result.concat(data));
								this.isLoad = true;		
							});
						}
					});
				});			
			}
		}
		this.result = null;
		
	}
	addToContact(contactId:number){
		this.contactService.addContact(contactId).subscribe(succes=>{
			let userInfo = this.result.filter(t=>t.Id==contactId)[0];
			let newContact = new UserContact();
			newContact.Id = contactId;
			newContact.Name= userInfo.Name;
			newContact.City= userInfo.City;
			newContact.Avatar = userInfo.Avatar;
			newContact.State = ContactState.Sent;
            this.contactService.changeContactNotify(newContact);
            this.eventEmitterService.addNewContact.emit(newContact); 
        },
	    async err => {
			await this.contactService.handleTokenErrorIfExist(err).then(ok => {
				if (ok) { 
		    		this.contactService.addContact(contactId).subscribe(succes => {                
		    			let userInfo = this.result.filter(t=>t.Id==contactId)[0];
			    		let newContact = new UserContact();
			    		newContact.Id = contactId;
			    		newContact.Name= userInfo.Name;
					    newContact.City= userInfo.City;
				    	newContact.Avatar = userInfo.Avatar;
			    		newContact.State = ContactState.Sent;
                        this.contactService.changeContactNotify(newContact);
                        //this.eventEmitterService.addNewContact.emit(newContact); 
			    	});
		     	}
			});
		});
	}
	checkInContact(id:number):boolean{
		return this.contactList.filter(t=> t.State!=ContactState.Canceled).filter(t=> t.State!=ContactState.Decline).map(t=>t.ContactId).indexOf(id) > -1 ;
	}
	findContact(id:number):string{
		let state =  this.contactList.filter(t=>t.ContactId==id)[0];
		if (state) {
			switch (state.State) {
				case ContactState.New:
					return "new_releases";
				case ContactState.Sent:
					return "person_add";
				case ContactState.Canceled:
					return "clear";
		    	default:
		    		return "";
		    }
		}
	}


	ContainsCyrillicChar(str) {
		return /[\u0400-\u04FF]/.test(str);
	}

	ChangeLayout(str: string, replacePattern: any): string {
		let replaceTo: string;
				for(let i=0; i < str.length; i++){
					if( replacePattern[ str[i].toLowerCase() ] != undefined){
						if(str[i] == str[i].toLowerCase()){
							replaceTo = replacePattern[ str[i].toLowerCase() ];   
						} else if(str[i] == str[i].toUpperCase()){
							replaceTo = replacePattern[ str[i].toLowerCase() ].toUpperCase();
						}
						str = str.replace(str[i], replaceTo);
					}
				}
			return str;
	}

	deleteDuplicatedResults(array) {
		let arr = array.concat();
		for(let i=0; i<arr.length; ++i) {
			for(let j=i+1; j<arr.length; ++j) {
				if(arr[i].Id === arr[j].Id)
					arr.splice(j--, 1);
			}
		}
		return arr;
	}

	private UAorRUtoENReplacePattern = {
		"й":"q", "ц":"w", "у":"e", "к":"r", "е":"t", "н":"y", "г":"u", "ш":"i", "щ":"o", "з":"p", "х":"[", "ъ":"]", "ї":"]",
		"ф":"a", "ы":"s", "і":"s", "в":"d", "а":"f", "п":"g", "р":"h", "о":"j", "л":"k", "д":"l", "ж":";", "э":"'", "є":"'",
		"я":"z", "ч":"x", "с":"c", "м":"v", "и":"b", "т":"n", "ь":"m", "б":",", "ю":".", ".":"/",
		" ":" "
	}; 
	private ENtoUAReplacePattern = {
		"q":"й", "w":"ц"  , "e":"у" , "r":"к" , "t":"е", "y":"н", "u":"г", "i":"ш", "o":"щ", "p":"з" , "[":"х" , "]":"ї",
		"a":"ф", "s":"і", "d":"в" , "f":"а"  , "g":"п" , "h":"р" , "j":"о", "k":"л", "l":"д", ";":"ж" , "'":"є",
		"z":"я", "x":"ч", "c":"с", "v":"м", "b":"и", "n":"т", "m":"ь", ",":"б", ".":"ю", "/":".",
		" ":" "
	};   
	private ENtoRUReplacePattern = {
		"q":"й", "w":"ц", "e":"у", "r":"к", "t":"е", "y":"н", "u":"г", "i":"ш", "o":"щ", "p":"з", "[":"х", "]":"ъ",
		"a":"ф", "s":"ы", "d":"в", "f":"а", "g":"п", "h":"р", "j":"о", "k":"л", "l":"д", ";":"ж", "'":"э",
		"z":"я", "x":"ч", "c":"с", "v":"м", "b":"и", "n":"т", "m":"ь", ",":"б", ".":"ю", "/":".",
		" ":" "
	};
	
}
