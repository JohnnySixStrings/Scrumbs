import { Component, Input, OnInit } from '@angular/core';
import { CardInfo, House } from '../speed-game/speed-game.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {
  cardImgUrl!: string;
  @Input()
  cardInfo!: CardInfo;

  ngOnInit(): void {
    this.cardInfo.suiteNumber;
    this.cardImgUrl = `../../assets/cardImages/${
      this.cardInfo.suiteNumber
    }_of_${House[this.cardInfo.house].toLowerCase()}s.png`;
  }
}
