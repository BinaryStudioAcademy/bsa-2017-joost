import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'avatarPipe'})
export class AvatarPipe implements PipeTransform { // version just for friday meeting

    transform(value: string, isGroup: boolean): string {
        if(isGroup) {
            if (value == "" || value == null) {
                return "assets/img/Group-icon.png";
            }
            else {
                let id = value.substring(0,value.indexOf('_'));
                return "http://localhost:51248/api/avatars/groups/"+id;
            }
        }
        else {
            if (value == null || value == "") {
                return "assets/img/man.png"
            }
            else {
                if  (value.search("random") != -1) {
                    return value;
                }
                let id = value.substring(0,value.indexOf('_'));
                return "http://localhost:51248/api/avatars/"+id;
            }
        }
    }

}