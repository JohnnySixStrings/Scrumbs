import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { SignalrService } from '../signalr.service';
import { Subject } from 'rxjs';

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

  //hand: CardInfo[] = [{ suiteNumber: 3, house: House.Club, faceUp: true }];

  constructor(private signalr: SignalrService) {

    signalr.startConnection();

    signalr.addHandler('MoveHandler', (user, card) => {
      this.hand1.push(card);
      console.log(user);
    });

    signalr.addHandler('NewGame', (data) => {
      this.hand1 = data.playerOneHand;
      this.hand2 = data.playerTwoHand;
      this.continueL = data.continueL;
      this.continueR = data.continueR;
      this.hand1Stack = data.playerOneStack;
      this.hand2Stack = data.playerTwoStack;
      this.playL = data.playL;
      this.playR = data.playR;
    });
  }

  ngOnDestroy(): void {
    this.signalr.disposeHandlers('MoveHandler');
    this.signalr.disposeHandlers('NewGame');
  }

  drop(event: CdkDragDrop<CardInfo[]>) {

    if (!this.isValidPlay(event)) {
      return; 
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        0
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        0
      );

      this.hand2.push(this.hand2Stack[this.hand2Stack.length - 1]);
      this.hand2Stack.pop();
    }
 
  }

  isValidPlay(event: CdkDragDrop<CardInfo[]>) {

    let valid: boolean = false;
    let container = event.container.data[0].suiteNumber;
    let pcontainer = event.previousContainer.data[event.previousIndex].suiteNumber;
    let element = event.container.element.nativeElement.id;

    if (element == "playL" || element == "playR") {
      if (container + 1 === pcontainer) {
        valid = true;
      }
      else if (container - 1 === pcontainer) {
        valid = true;
      }
      if (container == 13 && pcontainer == 1) {
        valid = true;
      }
      else if (container == 1 && pcontainer == 13) {
        valid = true;
      }
    }

    return valid; 
  }

  newGame() {
    this.signalr.newGame();
  }

  playCard() {
    this.signalr.playCard('bob', {
      suiteNumber: 3,
      house: House.Club,
      faceUp: true,
    });
  }

  test() {
    this.signalr.test();
  }

  matchPredicate(item: CdkDrag<CardInfo>) {
    return true;
  }

  noMatchPredicate() {
    return false;
  }

  ngOnInit(): void { }
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
