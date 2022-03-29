import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-speed-game',
  templateUrl: './speed-game.component.html',
  styleUrls: ['./speed-game.component.css']
})
export class SpeedGameComponent implements OnInit {
  hand1 = [1, 2, 3, 4, 5];
  hand2 = [6, 2, 3, 9, 10];
  playL = [3];
  playR = [4];
  continueL = [5, 5, 2, 3, 4];
  continueR = [5, 1, 3, 3, 4];

  //this needs fixing
  drop(event: CdkDragDrop<number[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }

/** Predicate function that only allows even numbers to be dropped into a list. */
matchPredicate(item: CdkDrag<number>) {
    return true;
}

/** Predicate function that doesn't allow items to be dropped into a list. */
noMatchPredicate() {
  return false;
}

  constructor() { }

  ngOnInit(): void {}

}

/* Cards: value 1-13, unique img for face, default img for back
  player hand and playable table cards are faceup, opponent hand are face down*/
interface cardInfo {
  faceImg: string;
  backImg: "./res/bradCard.png"
  value: string;
  cardState: 'facedown' | 'faceup';
  /* it would probably be easier to get rid of backImg here
    and use facedown to determine whether to show face or back, since back is a default */
}
