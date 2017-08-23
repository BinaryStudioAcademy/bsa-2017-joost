import { Pipe, PipeTransform } from '@angular/core';
import { UserState } from '../models/user-detail';

@Pipe({name: 'statePipe'})
export class StatePipe implements PipeTransform {
  transform(value: UserState): string {
    var rez:string = '<div class="user-state-container">\n'; 
    switch(value){
        case UserState.Online:
            rez += '<i class="material-icons online-state">check_circle</i>';
            break;
        case UserState.Busy:
            rez += '<i class="material-icons busy-state">remove_circle</i>';
            break;
        case UserState.Inaccesible, UserState.Offline:
            rez += '<i class="material-icons offline-state">panorama_fish_eye</i>';
            break;
        default:
            console.log("Wrong input data send to stateIconPipe")
        }
    rez += '\n<span>' + UserState[value] + '</span>\n</div>';
    return rez;
  }
}