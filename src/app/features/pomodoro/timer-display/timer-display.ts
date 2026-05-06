import { Component, OnDestroy, afterNextRender } from '@angular/core';
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
  private audio?: HTMLAudioElement;
  constructor() {
    // Audio olny available in browser and since NodeJS is server we need this so that it runs in browser or sm like that idk.
    afterNextRender(() => {
      this.audio = new Audio('assets/alert.mp3');
    });
  }
  timeLeft: number = 0;
  isRunning: boolean = false;

  initialSeconds: number = 30; // TODO: change into actual time (25min)
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
    if (this.isRunning){return}; // avoid duplicate instances

    this.isRunning = true;
    if (this.timerSub) this.timerSub.unsubscribe();

    const currentSeconds = this.countdownSource.value;
    this.timerSub = timer(0, 1000).pipe(
      take(currentSeconds + 1),
      map(tick => currentSeconds - tick)
    ).subscribe({
      next: (val) => this.countdownSource.next(val),
      complete: () => {
        this.isRunning = false;
        this.playAudio();
      }
    });
  }

  private playAudio() {
    if (this.audio) {
      this.audio.play().catch(error => {
        console.error("Error while playing sound:", error);
      });
    } else {
      console.warn("audio is not initialized or this is not a browser.");
    }
  }

  reset() {
    this.pause();
    this.countdownSource.next(this.initialSeconds);
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }
}
