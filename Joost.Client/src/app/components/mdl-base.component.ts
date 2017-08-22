import {Directive, AfterViewChecked} from '@angular/core';

declare var componentHandler: any;

export class MDL implements AfterViewChecked {

    ngAfterViewChecked() {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

}