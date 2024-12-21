import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';
import { Router } from '@angular/router';
import { SignalRConnectionService } from '../../services/signal-r-connection/signal-r-connection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html'
})
export class JoinComponent implements OnInit {
  playerName: string | undefined; 
  // Nome do jogador inserido
  private subscriptions: Subscription[] = []; 
  // Armazena todas as assinaturas para serem limpas ao destruir o componente


  constructor(
    private gameService: GameService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeConnection();
  }

  /**
   * Limpeza das assinaturas ao destruir o componente ajudando no desempenho da aplicação
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Inicializa a conexão com o hub
   */
  private initializeConnection(): void {
    this.gameService
      .initializeConnection()
      .catch((err) => {
        console.error(`Erro ao conectar: ${err}`);
      });
  }

  /**
   * Permite que o jogador entre no jogo se um nome foi inserido
   */
  joinGame(): void {
    if (this.isPlayerNameValid()) {
      this.gameService.joinGame(this.playerName!);
      this.navigateToLobby(); 
    } else {
      this.showMissingPlayerNameAlert(); 
    }
  }

  /**
   * Valida se o nome do jogador foi preenchido
   */
  private isPlayerNameValid(): boolean {
    return !!this.playerName;
  }

  /**
   * Exibe um alerta caso o nome do jogador não tenha sido preenchido
   */
  private showMissingPlayerNameAlert(): void {
    alert('O jogador deve ter um nome.');
  }

  /**
   * Navega para a página do lobby
   */
  private navigateToLobby(): void {
    this.router.navigate(['/lobby']);
  }
}
