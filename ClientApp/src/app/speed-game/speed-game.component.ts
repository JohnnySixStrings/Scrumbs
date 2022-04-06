import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { SignalrService } from '../signalr.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-speed-game',
  templateUrl: './speed-game.component.html',
  styleUrls: ['./speed-game.component.css'],
})
export class SpeedGameComponent implements OnInit, OnDestroy {
  hand1: CardInfo[];
  hand2: CardInfo[];
  playL: CardInfo[];
  playR: CardInfo[];
  continueL: CardInfo[];
  continueR: CardInfo[];
  hand1Stack: CardInfo[];
  hand2Stack: CardInfo[];
  name: FormControl = new FormControl;
  playerName: string = '';
  isPlayerOne: boolean = true;

  constructor(private signalr: SignalrService) {
    signalr.startConnection();

    signalr.addHandler('MoveHandler', (user, card) => {
      this.hand1.push(card);
      console.log(user);
    });

    signalr.addHandler('NewGame', (data) => {
      let connectionID = this.signalr.getConnectionId();
      if (connectionID == data.players[0].connectionId) {
        this.isPlayerOne = true;
        this.hand1 = data.playerOneHand;
        this.hand2 = data.playerTwoHand;
        this.continueL = data.continueL;
        this.continueR = data.continueR;
        this.hand1Stack = data.playerOneStack;
        this.hand2Stack = data.playerTwoStack;
        this.playL = data.playL;
        this.playR = data.playR;
      } else {
        this.isPlayerOne = false;
        this.hand2 = data.playerOneHand;
        this.hand1 = data.playerTwoHand;
        this.continueR = data.continueL;
        this.continueL = data.continueR;
        this.hand2Stack = data.playerOneStack;
        this.hand1Stack = data.playerTwoStack;
        this.playR = data.playL;
        this.playL = data.playR;
      }
    });
  }

  ngOnDestroy(): void {
    this.signalr.disposeHandlers('MoveHandler');
    this.signalr.disposeHandlers('NewGame');
  }
  //this needs fixing
  drop(event: CdkDragDrop<CardInfo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, 0);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        0
      );
    }
  }

  newGame() {
    this.signalr.newGame();
  }

  newUser() {
    this.playerName =  this.name.value;
    this.signalr.newUser(this.name.value);
  }

  playCard() {
    this.signalr.playCard('bob', {
      suiteNumber: 3,
      house: House.Club,
      faceUp: true,
    });
  }

  matchPredicate(item: CdkDrag<number>) {
    return true;
  }

  noMatchPredicate() {
    return false;
  }

  ngOnInit(): void {}
}

export interface CardInfo {
  suiteNumber: number;
  house: House;
  faceUp: boolean;
}

export enum House {
  Heart,
  Spade,
  Club,
  Diamond,
}