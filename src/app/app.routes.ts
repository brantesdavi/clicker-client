import { Routes } from '@angular/router';
import { JoinComponent } from './pages/join/join.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { GameComponent } from './pages/game/game.component';
import { PodiumComponent } from './pages/podium/podium.component';

export const routes: Routes = [
    {path: '', component: JoinComponent},
    {path: 'lobby', component: LobbyComponent},
    {path: 'game', component: GameComponent},
    {path: 'podium', component: PodiumComponent},
];
