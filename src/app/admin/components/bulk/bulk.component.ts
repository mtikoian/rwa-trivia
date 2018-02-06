import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource} from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Question, Category } from '../../../model';
import { BulkUploadActions, QuestionActions } from '../../../core/store/actions';
import { bulkUploadFileInfo, filePublishedQuestions } from 'app/core/store/reducers';
import { concat } from 'rxjs/operator/concat';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-bulk',
  templateUrl: './bulk.component.html',
  styleUrls: ['./bulk.component.scss']
})
export class BulkComponent implements OnInit {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  uploadFileInfos: BulkUploadFileInfo[];
  uploadsDS: FileUploadsDataSource;
  uploadsSubject: BehaviorSubject<BulkUploadFileInfo[]>;
  totalCount: number;

  fileQuestionsStatus:boolean = false;
  parsedQuestions: Array<Question>;
  unPublishedquestion: Question[];
  publishedquestion: Question[];

  bulkUploadObs: Observable<BulkUploadFileInfo[]>;
  UnPublishedQuestionObs: Observable<Question[]>;
  PublishedQuestionObs: Observable<Question[]>;
  sub: any;

  constructor(private store: Store<AppStore>,
              private questionActions: QuestionActions,
              private router: Router) {
    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);
    this.UnPublishedQuestionObs = store.select(s => s.fileUnpublishedQuestions);
    this.PublishedQuestionObs = store.select(s => s.filePublishedQuestions);

    this.bulkUploadObs = store.select(s => s.bulkUploadFileInfo);
    this.sub = this.UnPublishedQuestionObs.subscribe(question => this.unPublishedquestion = question);
    this.sub = this.PublishedQuestionObs.subscribe(question => this.publishedquestion = question);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
  } 
  ngOnInit() {
    this.sub = this.bulkUploadObs.subscribe(uploadFileInfos => this.uploadFileInfos = uploadFileInfos);
    this.uploadsSubject.next(this.uploadFileInfos);
  }

  getFileQuestions(id)
  {
    const bulkUploadFileInfoObject = new BulkUploadFileInfo();
    bulkUploadFileInfoObject.id = id;  

    // for unpublished questions
    this.store.dispatch(this.questionActions.loadFileUnpublishedQuestions(bulkUploadFileInfoObject));
    this.sub = this.UnPublishedQuestionObs.subscribe(question => this.unPublishedquestion = question);

    // for published questions
    this.store.dispatch(this.questionActions.loadFilePublishedQuestions(bulkUploadFileInfoObject));
    this.sub = this.PublishedQuestionObs.subscribe(question => this.publishedquestion = question);

    setTimeout(()=>{
      this.fileQuestionsStatus = true;
      this.parsedQuestions = this.unPublishedquestion;
      if(this.publishedquestion.length != 0)
      {
          for(let i=0;i<this.publishedquestion.length;i++)
          {
            this.parsedQuestions.push(this.publishedquestion[i]);
          }
      } 
      this.totalCount = this.parsedQuestions.length;
    },500);
    
  }

  ngOnDestroy() {
  }
  backToSummary(){
    this.fileQuestionsStatus = false;
  }

  pageChanged(pageEvent: PageEvent) {

  }
  categoryChanged(event: { categoryId: number, added: boolean }) {

  }
  tagChanged(event: { tag: string, added: boolean }) {

  }
  sortOrderChanged(sortOrder: string) {

  }
}

export class FileUploadsDataSource extends DataSource<BulkUploadFileInfo> {
  constructor(private uploadsObs: BehaviorSubject<BulkUploadFileInfo[]>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<BulkUploadFileInfo[]> {
    return this.uploadsObs;
  }

  disconnect() {}

}
