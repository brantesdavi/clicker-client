import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SignalRConnectionService, SignalREvent } from '../signal-r-connection/signal-r-connection.service';
import { GameStateService } from './game-state.service';
import { Player } from '../../models/Player.interface';


@Injectable({
  providedIn: 'root'
})
export class GameService {  

  /*
    Gerencia as regras do cliente para interação com o SignalR e o estado do jogo.
  */

  private hubConnection!: signalR.HubConnection;

  constructor(
    private signalRService: SignalRConnectionService,
    private gameStateService: GameStateService,
    private router: Router
  ) {}

  /**
   * Inicializa a conexão com o hub do SignalR
   */
  initializeConnection(): Promise<void> {
    return this.signalRService
      .startConnection('https://localhost:5001/gamehub')
      .then((hubConnection) => {
        this.hubConnection = hubConnection;
        this.registerEvents();
      });
  }

  /**
   * Registra o jogador no jogo com seu nome
   */
  joinGame(playerName: string): void {
    this.signalRService.invoke('JoinGame', playerName);
    this.gameStateService.playerName = playerName;
  }

  /**
   * Envia o tempo acumulado do clique para o hub
   */
  registerClick(): void {
    const elapsedTime = this.gameStateService.elapsedTime;
    this.hubConnection
      .invoke('ClickButton', elapsedTime, this.gameStateService.playerName)
      .catch((err) => {
        console.error('Erro ao registrar clique:', err);
      });
  }
  
  /**
   * Solicita o início do jogo ao hub
   */
  startGame(): void {
    this.signalRService.invoke('StartGame');
  }

  /**
   * Solicita o encerramento do jogo ao hub
   */
  endGame(): void {
    this.signalRService.invoke('EndGame');
  }

  /**
   * Registra os eventos do SignalR e os manipula.
   */
  private registerEvents(): void {
    // Atualiza a lista de jogadores.
    this.signalRService.register(SignalREvent.UpdatePlayersList, (players: Player[]) => {
      this.gameStateService.players = players;
    });

    // Define se o jogador é o host.
    this.signalRService.register(SignalREvent.HostAssigned, (isHost: boolean) => {
      this.gameStateService.isHost = isHost;
    });

    // Atualiza o turno atual.
    this.signalRService.register(SignalREvent.TurnChanged, (updatePlayers: Player[], nextPlayer: Player, isFirstTurn: boolean, ) => {
      
      this.gameStateService.players = updatePlayers;
      this.gameStateService.currentPlayer = nextPlayer;
      this.gameStateService.isFirstTurn = isFirstTurn;
    });

    // Alerta caso o jogo já tenha começado e impede que o usuario entre
    this.hubConnection.on('GameAlreadyStarted', () => {
      alert('O jogo já começou! Não é possível entrar agora.');
    });   
    
    // Navega para a tela de jogo quando ele começa
    this.signalRService.register(SignalREvent.GameStarted, () => {
      if (this.router.url === '/lobby') {
        this.router.navigate(['/game']);
      }
    });

    // Processa o fim do jogo e redireciona para o pódio
    this.signalRService.register(SignalREvent.GameOver, (podium: Player) => {
      this.gameStateService.setWinner(podium);
      this.gameStateService.resetGameState(); 
      if (this.router.url === '/game') {
        this.router.navigate(['/podium']);
      }
    });

    // Loga erro caso a conexão seja encerrada
    this.signalRService.onClose((error) => {
      console.error('Conexão perdida', error);
    });
  }
  
}
