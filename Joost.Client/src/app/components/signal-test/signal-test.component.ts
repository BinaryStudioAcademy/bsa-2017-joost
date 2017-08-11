import { Component, OnInit } from '@angular/core';
import { ChatHubService } from './../../services/chat-hub.service';

@Component({
  selector: 'app-signal-test',
  templateUrl: './signal-test.component.html',
  styleUrls: ['./signal-test.component.scss'],
  providers: [ChatHubService]
})

export class SignalTestComponent implements OnInit {

  constructor(private chatHubService: ChatHubService) { }

  ngOnInit() {
  }

}
