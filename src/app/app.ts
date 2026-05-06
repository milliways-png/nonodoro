import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TimerDisplay } from './features/pomodoro/timer-display/timer-display'; 
import { TimerControls } from './features/pomodoro/timer-controls/timer-controls';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DatePipe, TimerDisplay, TimerControls],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('nonodoro');
  today: number = Date.now();
}
