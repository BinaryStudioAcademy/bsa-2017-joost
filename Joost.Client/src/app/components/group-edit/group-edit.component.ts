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
export class GroupEditComponent extends MDL implements OnInit {
    group: Group;
    filteringArray: Array<UserContact> = [];
    editMode: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private groupService: GroupService,
        private location: Location,
        private contactService: ContactService
    ) {
            super();
    }
        
    onFilterArray(substr){
        this.filteringArray = this.group.UnselectedMembers
            .filter(member => member.Name.includes(substr));
    }

    onAddMember(userIndex: number) {
        this.group.SelectedMembersId.push(this.group.UnselectedMembers[userIndex].Id);
        this.group.SelectedMembers.push(this.group.UnselectedMembers[userIndex]);

        this.group.UnselectedMembers.splice(userIndex, 1);
    }

    onDeleteMember(userIndex: number) {
        this.group.UnselectedMembers.push(this.group.SelectedMembers[userIndex]);

        this.group.SelectedMembers.splice(userIndex, 1);
        this.group.SelectedMembersId.splice(userIndex, 1);
    }

    onSubmit() {
        if (!this.editMode) {
            // route: /groups/new
            this.groupService.addGroup(this.group).subscribe(response => {                
                console.log("Inserted");
            },
            async err => {
                await this.userService.handleTokenErrorIfExist(err).then(ok => {
                    if (ok) { 
                        this.groupService.addGroup(this.group).subscribe(response => {                
                            console.log("Inserted");
                        });
                    }
                });
            });
        } else {
            // route: /groups/edit/:id
            this.groupService.putGroup(this.group.Id, this.group).subscribe(response => {                
                console.log("Updated");
            }, 
            async err => {
                await this.userService.handleTokenErrorIfExist(err).then(ok => {
                    if (ok) { 
                        this.groupService.putGroup(this.group.Id, this.group).subscribe(response => {                
                            console.log("Updated");
                        });
                    }
                });
            });
        }
    }

    onCancel() {
        this.location.back();
    }

    ngOnInit() {
        this.route.params
            .subscribe(
            (params: Params) => {
                if (params['id']) {                
                    this.group.Id = +params['id'];
                    this.editMode = true;
                }
            }, 
            async err => {
                await this.userService.handleTokenErrorIfExist(err).then(ok => {
                    if (ok) { 
                        this.route.params.subscribe((params: Params) => {
                            if (params['id']) {                
                                this.group.Id = +params['id'];
                                this.editMode = true;
                            }
                        });
                    }
                });
            });

        if (!this.editMode) {
            // route: /groups/new
            this.group = new Group();
            this.contactService.getAllContacts()
                .subscribe(response => this.group.UnselectedMembers = this.filteringArray = response,
                    async err => {
                        await this.contactService.handleTokenErrorIfExist(err).then(ok => {
                            if (ok) { 
                                this.contactService.getAllContacts().subscribe(response => this.group.UnselectedMembers = this.filteringArray = response)
                            }
                        });
                    }
                );
        } else {
            // route: /groups/edit/:id
            this.groupService.getGroup(this.group.Id)
                .subscribe(response => {
                    this.group = response;
                    this.filteringArray = response.UnselectedMembers;
                },
                async err => {
                    await this.userService.handleTokenErrorIfExist(err).then(ok => { 
                        if (ok) {
                            this.groupService.getGroup(this.group.Id).subscribe(response => {                
                                this.group = response;
                                this.filteringArray = response.UnselectedMembers;
                            });
                        }
                    });
                });
        }            
    }
}
