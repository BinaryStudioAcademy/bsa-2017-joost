import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from "@angular/router";

import { UserDetail, UserState } from "../../models/user-detail";
import { UserService } from "../../services/user.service";
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {
  id: number = 0;
  editMode: boolean = false;
  name: string = "";
  description: string = "";
  imageUrl: string = "";
  members: Array<UserDetail> = [];
  selectedMembersId: Array<number> = [];
  selectedMembers: Array<UserDetail> = [];


  constructor(
    private route: ActivatedRoute,
    private userService: UserService, 
    private groupService: GroupService,
    private location: Location) { }

  onAddMember(userIndex: number){
    this.selectedMembersId.push(this.members[userIndex].Id);
    this.selectedMembers.push(this.members[userIndex]);
    this.members.splice(userIndex, 1);    
  }

  onDeleteMember(userIndex: number){
    this.members.push(this.selectedMembers[userIndex]);
    this.selectedMembers.splice(userIndex, 1);
    this.selectedMembersId.splice(userIndex, 1);    
  }

  onSubmit(){
    let newGroup = new Group();
    newGroup.Name = this.name;
    newGroup.MembersId = this.selectedMembersId;
    newGroup.Description = this.description;
    if (!this.editMode){
      // route: /groups/new
      this.groupService.addGroup(newGroup).subscribe(respone => {
        this.onCancel();
      });
    } else{
      // route: /groups/edit/:id
      this.groupService.putGroup(this.id, newGroup).subscribe(respone => {
        this.onCancel();
      });
    }    
  }

  onCancel(){
    this.location.back();
  }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        console.log(this.editMode);
      }
    );
    
    if (!this.editMode) {
      // route: /groups/new
      this.userService.getContacts().subscribe(response => {
        for(var i = 0; i < response.length; i++){
          this.userService.getUserDetails(response[i].ContactId).subscribe(response => {
            this.members.push(response);
          });
        }
      });
    } else {
      // route: /groups/edit/:id
      this.groupService.getGroup(this.id).subscribe(response => {
        this.description = response.Description;
        this.name = response.Name;
        this.selectedMembersId = response.MembersId;

        for(var i = 0; i < response.MembersId.length; i++){
          this.userService.getUserDetails(response.MembersId[i]).subscribe(response => {
            this.selectedMembers.push(response);
          });
        }
        for(var i = 0; i < response.ContactsId.length; i++){
          this.userService.getUserDetails(response.ContactsId[i]).subscribe(response => {
            this.members.push(response);
          });
        }
      });
    }
  }
}
