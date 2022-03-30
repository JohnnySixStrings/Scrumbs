import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: HubConnection;
  public startConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:24483/game')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log(`Error connecting: ${err}`));
  }
  constructor() {}
}
