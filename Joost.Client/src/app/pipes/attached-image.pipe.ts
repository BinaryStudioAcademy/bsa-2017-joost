import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'attachedImagePipe'})
export class AttachedImagePipe implements PipeTransform {

  transform(value: string): string {
      if(value != null) {
          return "http://localhost:51248/api/files/" + value;
        }
    }

}