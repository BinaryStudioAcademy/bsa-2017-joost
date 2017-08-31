import { Pipe, PipeTransform } from '@angular/core';

import { FileService } from "../services/file.service";

@Pipe({name: 'attachedImagePipe'})
export class AttachedImagePipe implements PipeTransform {

    constructor(private fileService: FileService) {  }

    transform(value: string): string {
        if(value != null) {
            // видаляю розширення, бо в url не може бути крапки
            return this.fileService.getFullFileUrlWithOutEx(value);
        }
    }

}