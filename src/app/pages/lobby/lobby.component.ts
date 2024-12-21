import { Component } from '@angular/core';
import { GameService, Player } from '../../services/game/game.service';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game/game-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  // styles: [':host{display:contents}'], // Makes component host as if it was not there, can offer less css headaches. Use @HostBinding class approach for easier overrides.
  // host: { class: 'contents' },
})
export class LobbyComponent {
  players: Player[] = []; 
  // Lista de jogadores conectados no lobby
  isHost: boolean = false; 
  // Indica se o jogador atual é o host
  canStartGame: boolean = false; 
  // Determina se o botão "Play!" deve estar habilitado
  private subscriptions: Subscription[] = []; 
  // Armazena todas as assinaturas para serem limpas ao destruir o componente

  constructor(
    public gameService: GameService, 
    private router: Router,
    private gameState: GameStateService
  ){}

  ngOnInit(): void {
    this.subscribeToIsHost();
    this.subscribeToPlayers();
  }

  /**
   * Limpeza das assinaturas ao destruir o componente ajudando no desempenho da aplicação
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Inscreve-se no estado que determina se o jogador é o host
   */
  private subscribeToIsHost(): void {
    const isHostSub = this.gameState.isHost$.subscribe((isHost) => {
      this.isHost = isHost;
    });
    this.subscriptions.push(isHostSub);
  }

  /**
   * Inscreve-se no estado que contém a lista de jogadores no lobby
   */
  private subscribeToPlayers(): void {
    const playersSub = this.gameState.players$.subscribe((players) => {
      this.players = players;
      this.updateCanStartGame();
    });
    this.subscriptions.push(playersSub);
  }

   /**
   * Determina se é possivel iniciar pelo numero de jogadores esperando
   */
   private updateCanStartGame(): void {
    this.canStartGame = this.players.length >= 2;
  }

  /**
   * Inicia o jogo se o jogador for o host, caso contrario não será possivel
   */
  startGame(): void {
    if (this.isHost) {
      this.gameService.startGame(); 
      this.router.navigate(['/game']);
    } else {
      console.log('Aguarde até que o host inicie o jogo.');
    }
  }
  
}
