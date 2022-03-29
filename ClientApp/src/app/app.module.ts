import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
<<<<<<< HEAD
import { SpeedGameComponent } from './speed-game/speed-game.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
=======
import { FlexModule } from '@angular/flex-layout';
>>>>>>> b024951ba10adb210b548c556187c15846fc1ad9

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
<<<<<<< HEAD
    SpeedGameComponent,
=======
>>>>>>> b024951ba10adb210b548c556187c15846fc1ad9
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'speed-game', component: SpeedGameComponent}
    ]),
    BrowserAnimationsModule,
<<<<<<< HEAD
    DragDropModule
=======
    FlexModule,
>>>>>>> b024951ba10adb210b548c556187c15846fc1ad9
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
