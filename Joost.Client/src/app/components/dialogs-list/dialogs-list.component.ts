import {Component} from '@angular/core';

@Component({
    selector: "dialogs-list",
    templateUrl: "./dialogs-list.component.html",
    styleUrls: ["./dialogs-list.component.css"]
})
export class DialogsListComponent{
    private dialogs=[
               {
            name: 'Name1',
            photo: 'https://www.w3schools.com/html/pic_mountain.jpg',
            unreadMessage: 3,
            lastMessage: "See you!",
            groupId:1
               } ,
                {
            name: 'Name2',
            photo: 'https://www.w3schools.com/css/trolltunga.jpg',
            unreadMessage: 7,
            lastMessage: "Realy?",
            groupId:2

        },
                {
            name: 'Name3',
            photo: 'https://cdn.pixabay.com/photo/2015/10/20/10/58/borderline-997613_960_720.jpg',
            unreadMessage: 5,
            lastMessage:"It's important!!!",
            groupId:3
        },
                {
            name: 'Name4',
            photo: 'https://cdn.pixabay.com/photo/2015/06/17/17/35/person-812796__180.jpg',
            unreadMessage: 0,
            lastMessage:"ok",
            groupId:4
        },
                {
            name: 'Name5',
            photo: 'http://img.timeinc.net/time/2011/personoftheyear/images/mag_content/poy_r3_1226.jpg',
            unreadMessage: 1,
            lastMessage:"And what?",
            groupId:5
        },
        {
            name: 'Name1',
            photo: 'https://www.w3schools.com/html/pic_mountain.jpg',
            unreadMessage: 3,
            lastMessage: "See you!",
            groupId:6
        },
                {
            name: 'Name2',
            photo: 'https://www.w3schools.com/css/trolltunga.jpg',
            unreadMessage: 7,
            lastMessage: "Realy?",
            groupId:7

        },
                {
            name: 'Name3',
            photo: 'https://cdn.pixabay.com/photo/2015/10/20/10/58/borderline-997613_960_720.jpg',
            unreadMessage: 5,
            lastMessage:"It's important!!!",
            groupId:8
        },
                {
            name: 'Name4',
            photo: 'https://cdn.pixabay.com/photo/2015/06/17/17/35/person-812796__180.jpg',
            unreadMessage: 0,
            lastMessage:"ok",
            groupId:9
        },
                {
            name: 'Name5',
            photo: 'http://img.timeinc.net/time/2011/personoftheyear/images/mag_content/poy_r3_1226.jpg',
            unreadMessage: 1,
            lastMessage:"And what?",
            groupId:10
        }
    ]
}