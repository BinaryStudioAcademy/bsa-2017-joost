import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../models/user-detail';

@Pipe({name: 'genderPipe'})
export class GenderPipe implements PipeTransform {
  transform(value: Gender): string {
    return Gender[value];
  }
}