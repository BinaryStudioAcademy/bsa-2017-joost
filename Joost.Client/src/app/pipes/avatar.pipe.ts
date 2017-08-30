import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'avatarPipe'})
export class AvatarPipe implements PipeTransform { // version just for friday meeting

    transform(value: string, isGroup: boolean): string {
      if (value == "" && isGroup)
          return "assets/img/Group-icon.png";
      if (value == null) {
          return "assets/img/man.png"
        }
        else {
            let id = value.substring(0,value.indexOf('_'));
            return "http://localhost:51248/api/avatars/"+id;
        }
    }

}