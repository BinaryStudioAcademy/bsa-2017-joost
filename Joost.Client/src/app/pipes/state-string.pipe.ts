import { Pipe, PipeTransform } from '@angular/core';
import { UserState } from '../models/user-detail';

@Pipe({name: 'stateStringPipe'})
export class StateStringPipe implements PipeTransform {
  transform(value: UserState): string {
    return UserState[value];
  }
}