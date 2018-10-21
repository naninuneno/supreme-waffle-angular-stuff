import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  // messageService must be public to bind it to template
  // Angular only binds to public component properties
  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}
