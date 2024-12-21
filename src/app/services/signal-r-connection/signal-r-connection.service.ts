import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

export enum SignalREvent {
  UpdatePlayersList = 'UpdatePlayersList',
  HostAssigned = 'HostAssigned',
  GameStarted = 'GameStarted',
  UpdatePlayerTime = 'UpdatePlayerTime',
  PlayerEliminated = 'PlayerEliminated',
  TurnChanged = 'TurnChanged',
  GameOver = 'GameOver',
  PlayerDisconnected = 'PlayerDisconnected',
}

@Injectable({ providedIn: 'root' })
export class SignalRConnectionService{
  private hubConnection!: signalR.HubConnection;

  startConnection(url: string): Promise<signalR.HubConnection> {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(url).build();
    return this.hubConnection.start().then(() => this.hubConnection);
  }

  register(event: SignalREvent, callback: (...args: any[]) => void): void {
    this.hubConnection.on(event, callback);
  }

  invoke(method: string, ...args: any[]): void {
    this.hubConnection.invoke(method, ...args).catch((err) => console.error(`Erro ao chamar ${method}`, err));
  }

  onClose(callback: (error?: Error) => void): void {
    this.hubConnection.onclose(callback);
  }
}