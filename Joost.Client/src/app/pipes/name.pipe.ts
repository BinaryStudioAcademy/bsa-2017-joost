import { Pipe, PipeTransform } from '@angular/core';
import { User} from '../models/user';
import { UserProfile } from '../models/user-profile';

@Pipe({name: 'namePipe'})
export class NamePipe implements PipeTransform {
  transform(value: User | UserProfile): string {
      var rez:string;
      if(value.FirstName == "" && value.LastName == "") {
          rez = '<h3>' + value.Email + '</h3>'; 
        }
        else {
            rez = '<h3>' + value.FirstName + ' ' + value.LastName + '</h3>'; 
        }
    return rez;
  }
}