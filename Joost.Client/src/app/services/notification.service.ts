import { Injectable } from '@angular/core';
import {ToastsManager, Toast} from 'ng2-toastr';
import {Component, ViewContainerRef} from '@angular/core';

export class NotificationsService{
    constructor(private toastr: ToastsManager, vRef: ViewContainerRef){
        this.toastr.setRootViewContainerRef(vRef);
    }
}