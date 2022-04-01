import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { SignalrService } from '../signalr.service';

@Component({
  selector: 'app-speed-game',
  templateUrl: './speed-game.component.html',
  styleUrls: ['./speed-game.component.css'],
})
export class SpeedGameComponent implements OnInit, OnDestroy {
  hand1 = [1, 2, 3, 4, 5];
  hand2 = [6, 2, 3, 9, 10];
  playL = [3];
  playR = [4];
  continueL = [5, 5, 2, 3, 4];
  continueR = [5, 1, 3, 3, 4];
  hand: CardInfo[] = [{ suiteNumber: 3, house: House.Club, faceUp: true }];
  constructor(private signalr: SignalrService) {
    signalr.startConnection();
    signalr.addHandler('MoveHandler', (user, card) => {
      this.hand1.push(card);
      console.log(user);
    });
    signalr.addHandler('NewGame', (data) => {
      this.hand1 = data.PlayerTwoHand;
      this.hand2 = data.PlayeOneHand;
    });
  }
  ngOnDestroy(): void {
    this.signalr.disposeHandlers('MoveHandler');
  }
  //this needs fixing
  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
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

  /** Predicate function that only allows even numbers to be dropped into a list. */
  matchPredicate(item: CdkDrag<number>) {
    return true;
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noMatchPredicate() {
    return false;
  }

  ngOnInit(): void {}
}
// backImg: "./res/bradCard.png"
/* Cards: value 1-13, unique img for face, default img for back
  player hand and playable table cards are faceup, opponent hand are face down*/
export interface CardInfo {
  suiteNumber: number;
  house: House;
  faceUp: boolean;
  /* it would probably be easier to get rid of backImg here
    and use facedown to determine whether to show face or back, since back is a default */
}
export enum House {
  Heart,
  Spade,
  Club,
  Diamond,
}
