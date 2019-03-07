import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { QuestionActions } from 'shared-library/core/store';
import { User, Question, QuestionStatus } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { MyQuestions } from './my-questions';
import { TabView } from 'tns-core-modules/ui/tab-view';
import { Page } from 'tns-core-modules/ui/page';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';


@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.css']
})

@AutoUnsubscribe()
export class MyQuestionsComponent extends MyQuestions implements OnDestroy {

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  displayReasonViewer = false;
  displayEditQuestion = false;
  selectedQuestion: Question;
  tabIndex = 0;

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
    private routerExtension: RouterExtensions,
    private page: Page) {
    super(store, questionActions);
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.userDict$.subscribe(userDict => this.userDict = userDict);
  }

  navigateToSubmitQuestion() {
    this.routerExtension.navigate(['/my/questions/add']);
  }

  displayReason(reasonFlag: boolean) {
    this.displayReasonViewer = reasonFlag;
    this.page.actionBarHidden = reasonFlag;
  }

  setSelectedQuestion(question: Question) {
    this.selectedQuestion = question;
  }

  showUpdateQuestion(displayFlag: boolean) {
    this.displayReasonViewer = false;
    this.displayEditQuestion = displayFlag;
    this.page.actionBarHidden = !displayFlag;
  }

  hideQuestion(displayEditQuestion: boolean) {
    this.displayEditQuestion = false;
    this.page.actionBarHidden = false;
  }

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
  }
  ngOnDestroy() {

  }

}
