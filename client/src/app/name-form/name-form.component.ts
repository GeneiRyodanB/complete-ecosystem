import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.css']
})
export class NameFormComponent implements OnInit {

  name: string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('Name variable is ' + this.name);
  }

}
