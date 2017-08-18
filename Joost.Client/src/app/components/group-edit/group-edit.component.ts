import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from "@angular/router";

import { UserService } from "../../services/user.service";
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { UserContact } from "../../models/user-contact";

@Component({
    selector: 'app-group-edit',
    templateUrl: './group-edit.component.html',
    styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {
    group: Group;
    editMode: boolean = false;


    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private groupService: GroupService,
        private location: Location) { }

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
            console.log(this.group);
            this.groupService.addGroup(this.group).subscribe(respone => {
                this.onCancel();
                console.log("Inserted");
            });
        } else {
            // route: /groups/edit/:id
            this.groupService.putGroup(this.group.Id, this.group).subscribe(respone => {
                this.onCancel();
                console.log("Updated");
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
                    this.editMode = params['id'] != null;
                }
            });

        if (!this.editMode) {
            // route: /groups/new
            this.group = new Group();
            this.userService.getAllContacts().subscribe(response => this.group.UnselectedMembers = response);
        } else {
            // route: /groups/edit/:id
            this.groupService.getGroup(this.group.Id).subscribe(response => {
                this.group = response;
                console.log(this.group);
            });
        }
    }
}
