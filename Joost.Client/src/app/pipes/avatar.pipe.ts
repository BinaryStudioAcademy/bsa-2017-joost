import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'avatarPipe'})
export class AvatarPipe implements PipeTransform { // version just for friday meeting

    transform(value: string, isGroup: boolean): string {
        if ((value == "" || value == null) && isGroup)
          return "assets/img/Group-icon.png";
        else if (value == null || value == "") {
          return "assets/img/man.png"
        }
        else {
            let id = value.substring(0,value.indexOf('_'));
            return "http://localhost:51248/api/avatars/"+id;
        }
    }

}