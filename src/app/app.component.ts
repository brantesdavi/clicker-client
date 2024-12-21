import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JoinModule } from './pages/join/join.module';
import { LobbyModule } from './pages/lobby/lobby.module';
import { GameModule } from './pages/game/game.module';
import { TimerModule } from './components/timer/timer.module';
import { PodiumModule } from './pages/podium/podium.module';
import { HeaderModule } from './components/header/header.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    JoinModule,
    LobbyModule,
    GameModule,
    TimerModule,
    PodiumModule,
    HeaderModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'clicker-front';
}
