import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  DropListRef,
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
  hand1: CardInfo[] = [];
  hand2: CardInfo[] = [];
  playL: CardInfo[] = [];
  playR: CardInfo[] = [];
  continueL: CardInfo[] = [];
  continueR: CardInfo[] = [];
  hand1Stack: CardInfo[] = [];
  hand2Stack: CardInfo[] = [];
  name: FormControl = new FormControl();
  playerName: string = '';
  player2Name: string = '';
  isPlayerOne: boolean = true;
  
  isPlayerWilling: boolean = true;
  isGameOver: boolean = false;
  isGameWon: boolean;

  constructor(private signalr: SignalrService) {
    signalr.startConnection();

    signalr.addHandler('MoveHandler', (data) => {
      this.hand1 = data.hand2.map((c) => ({
        suiteNumber: c.suiteNumber,
        house: c.house,
        faceUp: false,
      }));;
      this.hand2 = data.hand1.map((c) => ({
        suiteNumber: c.suiteNumber,
        house: c.house,
        faceUp: true,
      }));;
      this.continueR = data.continueL;
      this.continueL = data.continueR;
      this.hand2Stack = data.hand1Stack;
      this.hand1Stack = data.hand2Stack;
      this.playR = data.playL;
      this.playL = data.playR;    
    });

    signalr.addHandler('NewGame', (data) => {
      let connectionID = this.signalr.getConnectionId();
      if (connectionID == data.players[0].connectionId) {
        this.isPlayerOne = true;
        this.hand1 = data.playerOneHand;
        this.hand2 = data.playerTwoHand.map((c) => ({
          suiteNumber: c.suiteNumber,
          house: c.house,
          faceUp: true,
        }));
        this.continueL = data.continueL;
        this.continueR = data.continueR;
        this.hand1Stack = data.playerOneStack;
        this.hand2Stack = data.playerTwoStack;
        this.playL = data.playL;
        this.playR = data.playR;
        this.player2Name = data.players[1].userName;
      } else {
        this.isPlayerOne = false;
        this.hand2 = data.playerOneHand.map((c) => ({
          suiteNumber: c.suiteNumber,
          house: c.house,
          faceUp: true,
        }));
        this.hand1 = data.playerTwoHand;
        this.continueR = data.continueL;
        this.continueL = data.continueR;
        this.hand2Stack = data.playerOneStack;
        this.hand1Stack = data.playerTwoStack;
        this.playR = data.playL;
        this.playL = data.playR;
        this.player2Name = data.players[0].userName;
      }
    });

    signalr.addHandler('ResetHandler', (data) => {
      if (this.isPlayerOne == data.isPlayerOne) {
        this.continueR = data.continueR;
        this.continueL = data.continueL;
        this.playR = data.playR;
        this.playL = data.playL;
      } else {
        this.continueR = data.continueL;
        this.continueL = data.continueR;
        this.playR = data.playL;
        this.playL = data.playR;
      }
      
    })
  }

  ngOnDestroy(): void {
    this.signalr.disposeHandlers('MoveHandler');
    this.signalr.disposeHandlers('NewGame');
    this.signalr.disposeHandlers('ResetHandler');
  }

  playcard() {
    this.signalr.playCard({ hand1: this.hand1, hand2: this.hand2, playL: this.playL, playR: this.playR, continueL: this.continueL, continueR: this.continueR, hand1Stack: this.hand1Stack, hand2Stack: this.hand2Stack });
  }

  drop(event: CdkDragDrop<CardInfo[]>) {
    if (!this.isValidPlay(event)) {
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, 0);
    } else {
      event.previousContainer.data[event.previousIndex].faceUp = true; 
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        0
      );

      let pelement = event.previousContainer.element.nativeElement.id;

      if (pelement != "continueR" && pelement != "continueL") {
        let card: CardInfo = this.hand2Stack[this.hand2Stack.length - 1];
        card.faceUp = true;
        this.hand2.push(card);
        this.hand2Stack.pop();
      } 

      this.playcard();
    }
  }

  isValidPlay(event: CdkDragDrop<CardInfo[]>) {
    let valid: boolean = false;
    let container = event.container.data[0].suiteNumber;
    let pcontainer =
      event.previousContainer.data[event.previousIndex].suiteNumber;
    let element = event.container.element.nativeElement.id;
    let pelement = event.previousContainer.element.nativeElement.id;

    if (pelement == "continueR" || pelement == "continueL") {
       return true;
    }

    if (element == 'playL' || element == 'playR') {
      if (container + 1 === pcontainer) {
        valid = true;
      } else if (container - 1 === pcontainer) {
        valid = true;
      }
      if (container == 13 && pcontainer == 1) {
        valid = true;
      } else if (container == 1 && pcontainer == 13) {
        valid = true;
      }
    }

    return valid;
  }

  newGame() {
    this.signalr.newGame();
  }

  playAgain() {
    this.signalr.playAgain(this.playerName, this.isPlayerWilling)
  }

  newUser() {
    this.playerName = this.name.value;
    this.signalr.newUser(this.name.value);
  }

  reset() {
    this.signalr.reset({ continueL: this.continueL, continueR: this.continueR, playL: this.playL, playR: this.playR, isPlayerOne: this.isPlayerOne});
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

//todo
// layout shifting on drag/drop
// pass data/gamestate between players on play-card func
// finalize Ui and make it look pretty
//add continue logic
