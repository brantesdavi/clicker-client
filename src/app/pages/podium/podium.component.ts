import { Component } from '@angular/core';
import { GameStateService } from '../../services/game/game-state.service';
import { GameService } from '../../services/game/game.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Player } from '../../models/Player.interface';

@Component({
  selector: 'app-podium',
  templateUrl: './podium.component.html',
  // styles: [':host{display:contents}'], // Makes component host as if it was not there, can offer less css headaches. Use @HostBinding class approach for easier overrides.
  // host: { class: 'contents' },
})
export class PodiumComponent {
  players: Player[] = []; 
  // Lista de jogadores do jogo
  winner: Player | null = null; 
  // Variável para armazenar o vencedor
  private subscriptions: Subscription[] = []; 
  // Armazena todas as assinaturas para serem limpas ao destruir o componente


  constructor(private gameService: GameService, private gameState: GameStateService, private router: Router) {}

  ngOnInit(): void {
    this.subscribeToWinner();
  }

  /**
   * Método para se inscrever no stream do vencedor. Ele atualiza a variável `winner`
   */
  private subscribeToWinner(): void {
    this.subscriptions.push(
      this.gameState.winner$.subscribe((winner) => {
        this.winner = winner;
      })
    );
  }
  
  /**
   * Limpeza das assinaturas ao destruir o componente ajudando no desempenho da aplicação
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Navega para a tela inicial e encerra o jogo
   */
  navigateToHome(): void {
    this.gameService.endGame(); 
    this.router.navigate(['/']);
  }
}
