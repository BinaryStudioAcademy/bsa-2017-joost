import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

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
  
  name: string = "";
  description: string = "";
  imageUrl: string = "";
  members: Array<UserDetail> = [];
  selectedMembers: Array<UserDetail> = [];


  constructor(
    private userService: UserService, 
    private groupService: GroupService,
    private location: Location) { }

  onAddMember(userIndex: number){
    this.selectedMembers.push(this.members[userIndex]);
    this.members.splice(userIndex, 1);    
  }

  onDeleteMember(userIndex: number){
    this.members.push(this.selectedMembers[userIndex]);
    this.selectedMembers.splice(userIndex, 1);    
  }

  onSubmit(){
    let newGroup = new Group();
    newGroup.Name = this.name;
    newGroup.Members = this.selectedMembers;
    newGroup.Description = this.description;

    this.groupService.addGroup(newGroup).subscribe();
  }

  onCancel(){
    this.location.back();
  }

  ngOnInit() {
    this.userService.getContacts().subscribe(response => {
      for(var i = 0; i < response.length; i++){
        this.userService.getUserDetails(response[i].ContactId).subscribe(response => {
          this.members.push(response);
        })
      }
    });
  }
}
