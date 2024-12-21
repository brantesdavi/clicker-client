import { Component, ViewChild } from '@angular/core';
import { GameService, Player } from '../../services/game/game.service';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { TimerComponent } from '../../components/timer/timer.component';
import { GameStateService } from '../../services/game/game-state.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  players: Player[] = []; 
  // Lista de jogadores no jogo

  player: Player | undefined;

  isMyTurn: boolean = false; 
  // Indica se é a vez do jogador
  firstTurn: boolean = true; 
  // Indica se é o primeiro turno do jogo
  showTimer: boolean = false; 
  // Variável para saber se o timer tem ou não que ser exibido
  isMyTurn$!: Observable<boolean>; 
  // Stream que determina se é a vez do jogador
  private subscriptions: Subscription[] = []; 
  // Armazena todas as assinaturas para serem limpas ao destruir o componente

  @ViewChild(TimerComponent, { static: false }) timerComponent!: TimerComponent; 
  // Referência ao componente de timer

  constructor(private gameService: GameService, private gameState: GameStateService) {}

  ngOnInit(): void {
    this.setupGameStateSubscriptions(); 
    this.setupTurnSubscriptions(); 
  }

  /**
   * Configura as assinaturas relacionadas ao estado do jogo
   */
  private setupGameStateSubscriptions(): void {
    this.subscriptions.push(
      this.gameState.players$.subscribe((players) => {
        this.players = players;
      })
    );

    this.isMyTurn$ = combineLatest([ 
      this.gameState.currentPlayer$, 
      this.gameState.playerName$ 
    ]).pipe(
      map(([currentPlayer, playerName]) => currentPlayer?.name === playerName)
    );

    this.subscriptions.push(
      this.isMyTurn$.subscribe((isMyTurn) => {
        this.isMyTurn = isMyTurn;
      })
    );

    this.subscriptions.push(
      this.gameState.isFirstTurn$.subscribe((isFirstTurn) => {
        this.firstTurn = isFirstTurn;
      })
    );
  }

  /**
   * Configura assinaturas relacionadas às mudanças de turno e atualiza o timer
   */
  private setupTurnSubscriptions(): void {
    this.subscriptions.push(
      this.gameState.currentPlayer$.subscribe((currentPlayer) => {
        if (!currentPlayer) return;

        if (this.isMyTurn) {
          this.handleMyTurn();
          this.timerComponent?.startTimer();
        } else {
          this.handleOpponentTurn();
        }
      })
    );
  }

  /**
   * Lógica para quando é a vez do jogador
   */
  private handleMyTurn(): void {
    this.showTimer = true;
  }

  /**
   * Lógica para quando é a vez de outro jogador
   */
  private handleOpponentTurn(): void {
    this.showTimer = false;
    this.timerComponent?.stopTimer(); 
  }

  /**
   * Registra o tempo do jogador e para o timer
   */
  onPlayerClick(): void {
    if (this.isMyTurn) {
      this.gameService.registerClick(); 
      this.timerComponent?.stopTimer();
    }
  }

  /**
   * Limpeza das assinaturas ao destruir o componente, ajudando no desempenho da aplicação
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
