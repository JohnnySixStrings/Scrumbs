import { Injectable } from '@angular/core';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: HubConnection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Debug)
    .withUrl('/game')
    .build();

  constructor() {}
  public startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log(`Error connecting: ${err}`));
  }

  public addHandler(funcName: string, func: any) {
    this.hubConnection.on(funcName, func);
  }
  public disposeHandlers(funcName: string) {
    this.hubConnection.off(funcName);
  }
  public playCard() {
    this.hubConnection.send('PlayCard');
  }
}
