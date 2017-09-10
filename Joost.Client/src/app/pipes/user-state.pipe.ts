import { Pipe, PipeTransform } from '@angular/core';
import { UserState } from '../models/user-detail';

@Pipe({
  name: 'userState'
})
export class UserStatePipe implements PipeTransform {

   transform(value: UserState): string {
    var rez:string = ''; 
    switch(value){
        case UserState.Online:
            rez += '<i class="online-state user-state"></i>';
            break;
        case UserState.Busy:
            rez += '<i class="busy-state user-state"></i>';
            break;
        case UserState.Offline:
            rez += '<i class="offline-state user-state"></i>';
            break;
        case UserState.Inaccesible:
            rez += '<i class="inacceptable-state user-state"></i>';
            break;
        default:
            console.log("Wrong input data send to stateIconPipe")
        }
    return rez;
  }

}
