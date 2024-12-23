import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../../models/Player.interface';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {

  /*
    Utiliza BehaviorSubjects para gerenciar o estado reativo do jogo no cliente, notificando 
    componentes em tempo real
  */

  private playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();
// Gerencia a lista de jogadores atualizada dinamicamente durante o jogo

  private isHostSubject = new BehaviorSubject<boolean>(false);
  isHost$ = this.isHostSubject.asObservable();
  // Armazena se o jogador atual é o host, 
  // necessário para exibir ações exclusivas como "Iniciar Jogo".

  private currentPlayerSubject = new BehaviorSubject<Player | null>(null);
  currentPlayer$ = this.currentPlayerSubject.asObservable();
  // Representa o jogador que está no turno atual, usado para destacar o jogador ativo.

  private isFirstTurnSubject = new BehaviorSubject<boolean>(true);
  isFirstTurn$ = this.isFirstTurnSubject.asObservable();
  // Indica se é o primeiro turno do jogo, usado para lógica específica de início de jogo.

  private playerNameSubject = new BehaviorSubject<string | null>(null);
  playerName$ = this.playerNameSubject.asObservable();
  // Guarda o nome do jogador atual, e é usado para identificar o jogador atual

  private elapsedTimeSubject = new BehaviorSubject<number>(0);
  elapsedTime$ = this.elapsedTimeSubject.asObservable();
  // Controla o tempo acumulado pelo jogador, que é usado para eliminar

  private winnerSubject = new BehaviorSubject<Player | null>(null);
  winner$ = this.winnerSubject.asObservable();
  // Armazena o vencedor do jogo ao final, utilizado na tela de pódio

  /* Métodos para atualizar e manipular os valores dos BehaviorSubjects */

  set players(players: Player[]) {
    this.playersSubject.next(players);
  }

  set elapsedTime(time: number) {
    this.elapsedTimeSubject.next(time);
  }

  get elapsedTime(): number {
    return this.elapsedTimeSubject.value;
  }

  get players(): Player[] {
    return this.playersSubject.value;
  }

  set isHost(isHost: boolean) {
    this.isHostSubject.next(isHost);
  }

  set currentPlayer(player: Player | null) {
    this.currentPlayerSubject.next(player);
  }

  set isFirstTurn(isFirst: boolean) {
    this.isFirstTurnSubject.next(isFirst);
  }

  get isFirstTurn(): boolean {
    return this.isFirstTurnSubject.value;
  }

  set playerName(name: string | null) {
    this.playerNameSubject.next(name);
  }

  get playerName(): string | null {
    return this.playerNameSubject.value;
  }

  // Método que define o vencedor
  setWinner(winner: Player): void {
    this.winnerSubject.next(winner);
  }

  // Adiciona um jogador à lista
  addPlayer(newPlayer: Player): void {
    const updatedPlayers = [...this.playersSubject.value, newPlayer];
    this.playersSubject.next(updatedPlayers);
  }

  // Marca um jogador como eliminado
  defeatPlayer(defeatedPlayerName: string): void {
    const updatedPlayers = this.playersSubject.value.map((player) => {
      if (player.name === defeatedPlayerName) {
        return { ...player, status: 0 }; // Set status to 0 to indicate elimination
      }
      return player;
    });
  }

  // Reseta todo o estado do jogo para valores iniciais
  resetGameState(): void {
    this.playersSubject.next([]); 
    this.isHostSubject.next(false); 
    this.currentPlayerSubject.next(null); 
    this.isFirstTurnSubject.next(true); 
    this.playerNameSubject.next(null);  
    this.elapsedTimeSubject.next(0); 
  }
  
}
