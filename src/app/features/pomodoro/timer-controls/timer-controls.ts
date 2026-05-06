import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'

@Component({
  selector: 'app-timer-controls',
  imports: [MatButtonModule],
  templateUrl: './timer-controls.html',
  styleUrl: './timer-controls.css',
})
export class TimerControls {}
