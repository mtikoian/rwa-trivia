import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { Game } from './game';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

@AutoUnsubscribe()
export class GameComponent extends Game implements OnInit, OnDestroy {
  user: User;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  displayQuestion = false;
  constructor(public store: Store<AppState>,
    private utils: Utils) {
    super(store);
  }

  ngOnInit() {
    setTimeout(() => this.displayQuestion = true, 0);

  }
  ngOnDestroy() {

  }
}
