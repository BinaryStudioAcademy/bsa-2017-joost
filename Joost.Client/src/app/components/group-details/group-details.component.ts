import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from "@angular/router";

import { UserService } from "../../services/user.service";
import { ContactService } from "../../services/contact.service";
import { Group } from "../../models/group";
import { GroupService } from "../../services/group.service";
import { MDL } from "../mdl-base.component";
import { FileService } from "../../services/file.service";
import { AvatarService } from "../../services/avatar.service";
import { UserDetail } from "../../models/user-detail";

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})

// поки зроблю працююча лише для сценарію  сторення новрї групи
export class GroupDetailsComponent extends MDL implements OnInit {
    group: Group;
    selectedMembers: Array<UserDetail> = [];
    filteredMembers: Array<UserDetail> = [];
    filterStr: string;

    constructor(
        private route: ActivatedRoute,
        private groupService: GroupService,
        private location: Location,
        private router: Router,
        private contactService: ContactService,
    ) {
            super();
    }
    
    ngOnInit(): void {
      // get group id (if it exist)
      let id: number;
      this.route.params
          .subscribe(
          (params: Params) => {
              if (params['id']) {                
                id = +params['id'];
              }
          });
      
      // get current user contact list

      this.groupService.getGroup(id)
        .subscribe(response => {
            this.group = response;
            this.loadMembers();
        },
        async err => {
            await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
                if (ok) {
                    this.groupService.getGroup(id).subscribe(response => {                
                      this.group = response;
                      this.loadMembers();
                    });
                }
            });
        });       
    }

    onSearch(substr: string): void{
        this.filterStr = substr.toLocaleLowerCase();
        this.filteredMembers = this.selectedMembers.filter(member => (member.FirstName + ' ' + member.LastName).toLocaleLowerCase().includes(this.filterStr));
    }

    loadMembers(): void{
        if(this.group){
            this.groupService.getGroupMembers(this.group.Id)
            .subscribe(response => {
                this.selectedMembers = response;
                this.filteredMembers = this.selectedMembers;
            },
                async err => {
                    await this.contactService.handleTokenErrorIfExist(err).then(ok => {
                        if (ok) {
                            this.groupService.getGroupMembers(this.group.Id).subscribe(response => {
                                this.selectedMembers = response;
                                this.filteredMembers = this.selectedMembers;
                            })
                        }
                    });
                }
            );
        }
    }

    onGoToUser(Id: number){
      this.router.navigate(["/menu/user-details", Id]);
    }

    goBack(): void {
      this.location.back();
    }
}
