import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from "@angular/router";

import { UserService } from "../../services/user.service";
import { ContactService } from "../../services/contact.service";
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { UserContact } from "../../models/user-contact";
import { MDL } from "../mdl-base.component";

@Component({
    selector: 'app-group-edit',
    templateUrl: './group-edit.component.html',
    styleUrls: ['./group-edit.component.scss']
})
// поки зроблю працююча лише для сценарію  сторення новрї групи
export class GroupEditComponent extends MDL implements OnInit {
    group: Group;
    unselectedMembers: Array<UserContact> = [];
    selectedMembers: Array<UserContact> = [];
    filteredMembers: Array<UserContact> = [];
    filterStr: string;
    editMode: boolean = false;
    
    constructor(
        private route: ActivatedRoute,
        private groupService: GroupService,
        private location: Location,
        private contactService: ContactService
    ) {
            super();
    }
    
    ngOnInit() {
        // get group id (if it exist)
        this.route.params
            .subscribe(
            (params: Params) => {
                if (params['id']) {                
                    this.group.Id = +params['id'];
                    this.editMode = true;
                }
            });
        
        // get current user contact list
        this.contactService.getAllContacts()
        .subscribe(response => this.unselectedMembers = response,
            async err => {
                await this.contactService.handleTokenErrorIfExist(err).then(ok => {
                    if (ok) { 
                        this.contactService.getAllContacts().subscribe(response => this.unselectedMembers = response)
                    }
                });
            }
        );
        
        // init class members
        if (!this.editMode) {
            // route: /groups/new
            this.group = new Group();
        } else {
            // route: /groups/edit/:id
            this.groupService.getGroup(this.group.Id)
                .subscribe(response => {
                    this.group = response;
                    this.initArrays();
                },
                async err => {
                    await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
                        if (ok) {
                            this.groupService.getGroup(this.group.Id).subscribe(response => {                
                                this.group = response;
                                this.initArrays();
                            });
                        }
                    });
                });
        }            
    }

    onSearch(substr: string){
        this.filterStr = substr;
        this.filteredMembers = this.unselectedMembers.filter(member => member.Name.includes(substr));
    }

    onClick(e:number){
        console.log(e);
    }

    onAddMember(userId: number) {
        let index = this.unselectedMembers.findIndex( u=> u.Id == userId);
        if(index != -1) {
            this.group.SelectedMembersId.push(userId);
            this.selectedMembers.push(this.unselectedMembers[index]);
            this.unselectedMembers.splice(index, 1);
        };
    }

    onDeleteMember(userId: number) {
        let index = this.selectedMembers.findIndex( u=> u.Id == userId);
        if(index != -1) {
            this.group.SelectedMembersId.splice(index, 1);
            this.unselectedMembers.push(this.selectedMembers[index]);
            this.selectedMembers.splice(index, 1);
        };
    }

    onSubmit() {
        // if (!this.editMode) {
        //     // route: /groups/new
        //     this.groupService.addGroup(this.group).subscribe(response => {                
        //         console.log("Inserted");
        //     },
        //     async err => {
        //         await this.userService.handleTokenErrorIfExist(err).then(ok => {
        //             if (ok) { 
        //                 this.groupService.addGroup(this.group).subscribe(response => {                
        //                     console.log("Inserted");
        //                 });
        //             }
        //         });
        //     });
        // } else {
        //     // route: /groups/edit/:id
        //     this.groupService.putGroup(this.group.Id, this.group).subscribe(response => {                
        //         console.log("Updated");
        //     }, 
        //     async err => {
        //         await this.userService.handleTokenErrorIfExist(err).then(ok => {
        //             if (ok) { 
        //                 this.groupService.putGroup(this.group.Id, this.group).subscribe(response => {                
        //                     console.log("Updated");
        //                 });
        //             }
        //         });
        //     });
        // }
    }

    onCancel() {
        this.location.back();
    }

    initArrays(){
        if(this.group) {
            for(let id in this.group.SelectedMembersId) {
                let index = this.unselectedMembers.findIndex( u=> u.Id == +id);
                if(index != -1) {
                    this.selectedMembers.push(this.unselectedMembers[index]);
                    this.unselectedMembers.splice(index, 1);
                }
            }
        }
    }


    trackByUsers(index: number, user: UserContact): number { 
        return user.Id;
    }
}
