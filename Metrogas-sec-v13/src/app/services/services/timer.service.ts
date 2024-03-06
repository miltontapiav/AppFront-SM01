import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class TimerService {

  private countdownSource = new BehaviorSubject<number>(0);
  countdown$ = this.countdownSource.asObservable();

  private showTimerSource = new BehaviorSubject<boolean>(false);
  showTimer$ = this.showTimerSource.asObservable();

  private formattedCountdownSource = new BehaviorSubject<string>('');
  formattedCountdown$ = this.formattedCountdownSource.asObservable();

  constructor(

  ) { }

  setTimer(durationInSeconds: number): void {
    this.showTimerSource.next(true);

    const savedTime = localStorage.getItem('timerService.remainingTime');
    const remainingTime = savedTime ? Math.max(0, parseInt(savedTime, 10)) : durationInSeconds;

    const startTime = Date.now();
    interval(1000)
      .pipe(
        takeWhile(() => Date.now() - startTime <= durationInSeconds * 1000)
      )
      .subscribe(() => {
        const elapsedTimeInSeconds = Math.floor(
          (Date.now() - startTime) / 1000
        );
        const newRemainingTime = Math.max(0, remainingTime - elapsedTimeInSeconds);

        this.countdownSource.next(newRemainingTime);
        localStorage.setItem('timerService.remainingTime', newRemainingTime.toString());

        this.formattedCountdownSource.next(this.formatTime(newRemainingTime));

        if (newRemainingTime <= 1) {
          this.showTimerSource.next(false);
          localStorage.removeItem('timerService.remainingTime');
          
        }
        
      });
    
  }

  setShowTimer(showTimer: boolean): void {
    this.showTimerSource.next(showTimer);
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  resetTimer(): void {
    localStorage.removeItem('timerService.remainingTime');
    this.countdownSource.next(0);
    this.formattedCountdownSource.next('00:00');
    this.showTimerSource.next(false);
  }
}
