import { Component, OnInit } from '@angular/core';
import { GameStateService } from '../../services/game/game-state.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
})
export class TimerComponent implements OnInit {
  timerDisplay: string = '00.00'; 
  private timerInterval: any; 
  private elapsedTime: number = 0; 

  constructor(private gameState: GameStateService) {}

  ngOnInit(): void {
    this.elapsedTime = this.gameState.elapsedTime * 100; 
    this.updateTimerDisplay();
    this.startTimer(); 
  }

  startTimer(): void {
    this.stopTimer();

    // Inicia o intervalo do timer
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
      this.updateTimerDisplay();
      this.updateGameStateElapsedTime();
    }, 10);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer(): void {
    this.stopTimer();
    this.elapsedTime = 0;
    this.timerDisplay = '00.00';
  }

  private updateTimerDisplay(): void {
    const seconds = Math.floor(this.elapsedTime / 100);
    const centiseconds = this.elapsedTime % 100;
    this.timerDisplay = `${this.padNumber(seconds)}.${this.padNumber(centiseconds)}`;
  }

  private updateGameStateElapsedTime(): void {
    this.gameState.elapsedTime = this.elapsedTime / 100;
  }

  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
