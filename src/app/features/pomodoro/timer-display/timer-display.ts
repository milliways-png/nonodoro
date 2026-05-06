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
  isRunning: boolean = false;

  initialSeconds: number = 120; // 120 secs = 2 min
  private countdownSource = new BehaviorSubject<number>(this.initialSeconds);
  countdown$ = this.countdownSource.asObservable();

  private timerSub?: Subscription;
 
  toggleTimer() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  pause() {
    if (this.timerSub) {
      this.timerSub.unsubscribe(); // halt flow
      this.isRunning = false;
    }    
  }

  start() {
    // avoid multiple subscriptions
    if (this.isRunning){return}; // avoid duplicate instances

    this.isRunning = true;
    if (this.timerSub) this.timerSub.unsubscribe();

    const currentSeconds = this.countdownSource.value;
    this.timerSub = timer(0, 1000).pipe(
      take(currentSeconds + 1),
      map(tick => currentSeconds - tick)
    ).subscribe({
      next: (val) => this.countdownSource.next(val),
      complete: () => (this.isRunning = false)
    });
  }

  reset() {
    this.pause();
    this.countdownSource.next(this.initialSeconds);
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }
}
