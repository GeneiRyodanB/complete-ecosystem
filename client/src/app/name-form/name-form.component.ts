import { Component, OnInit } from '@angular/core';
import { GreetingService } from '../greeting/greeting.service';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.css']
})
export class NameFormComponent implements OnInit {

  name: string;

  constructor(private greetingService: GreetingService) {}

  ngOnInit() {
  }

  onSubmit() {
    this.greetingService.getGreeting(this.name);
  }

}
