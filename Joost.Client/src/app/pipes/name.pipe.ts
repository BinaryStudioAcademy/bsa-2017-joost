import { Pipe, PipeTransform } from '@angular/core';
import { User} from '../models/user';
import { UserProfile } from '../models/user-profile';

@Pipe({name: 'namePipe'})
export class NamePipe implements PipeTransform {
  transform(value: User | UserProfile): string {
      if(value.FirstName == null && value.LastName == null) {
          return value.Email.split('@')[0];
        }
        else {
            return value.FirstName + ' ' + value.LastName; 
        }
  }
}