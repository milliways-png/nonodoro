import { Component, OnDestroy } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import { timer, Subscription, Observable, BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-timer-display',
  imports: [MatButtonModule, DatePipe, AsyncPipe],
  templateUrl: './timer-display.html',
  styleUrl: './timer-display.css',
})
export class TimerDisplay {
  timeLeft: number = 0;
  running: boolean = false;

  initialSeconds: number = 120; // 120 secs = 2 min
  private countdownSource = new BehaviorSubject<number>(this.initialSeconds);
  countdown$ = this.countdownSource.asObservable();

  private timerSub?: Subscription;
  
  start() {
    // avoid multiple subscriptions
    if (this.timerSub) this.timerSub.unsubscribe();

    this.timerSub = timer(0, 1000).pipe(
      take(this.initialSeconds + 1),
      map(tick => this.initialSeconds - tick)
    ).subscribe(val => this.countdownSource.next(val));
  }
  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }
}
