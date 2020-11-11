import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NavigationExtras } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ObjectNameMatchFetchResults } from '@client/app/ngrx/actions/object-name-match.actions';
import { IObjectNameMatchResult } from '../../models/object-name-match-result.model';
import { selectNeatObjectQueryStatus } from '@client/app/ngrx/selectors/neat-object-query.selectors';
import { AppState } from '@client/app/ngrx/reducers';
import { sleep } from '@client/app/utils/sleep';
import {
  NeatObjectQueryFetchResults,
  NeatObjectQuerySetStatus
} from '@client/app/ngrx/actions/neat-object-query.actions';
import { selectObjectNameMatchResults } from '@client/app/ngrx/selectors/object-name-match.selectors';
import { DelayedRouterService } from '@client/app/core/services/delayed-router/delayed-router';
import { MatDialog } from '@angular/material/dialog';
import { UnrecognizedNameDialogComponent } from './unrecognized-name-dialog.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;

  myForm: FormGroup;
  objectNameMatchResults: IObjectNameMatchResult[] = [];
  searchMessage = 'Search For Object';
  isWaitingForData = false;
  lengthOfLongestDisplayText = 0;
  latestInputText = '';
  // successColor = '#66ff00'; // my green
  // successColor = '#FFC107'; // amber
  successColor = '#689F38'; // mat-green
  subscriptions = new Subscription();
  searchTermChangeSubject: Subject<string> = new Subject<string>();

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private delayedRouter: DelayedRouterService
  ) {
    // ------------------------------------->>>

    // Define form group
    this.myForm = new FormGroup({
      objectSearch: new FormControl({
        value: this.latestInputText,
        disabled: this.isWaitingForData
      }),
      forceRefresh: new FormControl({ value: false })
    });

    this.subscriptions.add(
      this.store.select(selectObjectNameMatchResults).subscribe(results => {
        this.objectNameMatchResults = results;
        // Compute length of longest display text
        this.lengthOfLongestDisplayText = results
          .map(el => el.display_text.length)
          .reduce((acc, el) => {
            return Math.max(acc, el);
          }, 0);
      })
    );

    this.subscriptions.add(
      this.store.select(selectNeatObjectQueryStatus).subscribe(status => {
        this.isWaitingForData = !!status && status.code === 'searching';
      })
    );

    // When the text of the input field updates, call the name-search api
    this.subscriptions.add(
      this.searchTermChangeSubject
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(latestInputText => {
          this.latestInputText = latestInputText;
          this.store.dispatch(new ObjectNameMatchFetchResults({ searchTerm: latestInputText }));
        })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  isTargetMatched() {
    const match = this.objectNameMatchResults.find(el => el.target === this.latestInputText.trim());
    return !!match;
  }

  submitObjectNameMatch(e: MouseEvent) {
    e.stopPropagation();
    this.tryLaunchingObjectQuery(true);
  }

  getSearchMessageText() {
    if (this.latestInputText.length === 0) return 'Search for Object';

    const target = this.latestInputText.trim();
    const match = this.objectNameMatchResults.find(el => el.target === target);
    if (!!match) return 'Match: ' + match.display_text;

    return 'Object Not Recognized';
  }

  getFormColor(): 'primary' | 'accent' | 'warn' {
    if (!this.latestInputText.length || !this.objectNameMatchResults.length) return 'primary';
    if (this.isTargetMatched()) return 'accent';
    return 'warn';
  }

  tryLaunchingObjectQuery(isRefreshed = false) {
    // -------------------------------------->>>

    const target = this.latestInputText.trim();

    if (this.isTargetMatched()) {
      this.launchObjectQuery(target, isRefreshed);
      return;
    }

    // If target isn't matched, give user option to search anyway
    const dialogRef = this.dialog.open<UnrecognizedNameDialogComponent, any>(
      UnrecognizedNameDialogComponent,
      { data: { submittedText: target } }
    );
    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(isSearchConfirmed => {
        if (!!isSearchConfirmed) {
          this.launchObjectQuery(target, isRefreshed);
        }
      })
    );
  }

  launchObjectQuery(objid: string, isRefreshed: boolean) {
    this.autocomplete.closePanel();
    this.store.dispatch(
      new NeatObjectQuerySetStatus({
        objid,
        message: 'Starting search....',
        code: 'searching'
      })
    );
    this.store.dispatch(new NeatObjectQueryFetchResults({ objectName: objid, isRefreshed }));
  }

  keyDownOnInputText(event: KeyboardEvent) {
    // Handle browser inconsistency on keystrokes
    // Advised here: https://stackoverflow.com/a/35395154/8620332
    let keyCode;
    if (event.key !== undefined) {
      keyCode = event.key;
    } else if ((event as any).keyIdentifier !== undefined) {
      keyCode = (event as any).keyIdentifier;
    } else if ((event as any).keyCode !== undefined) {
      keyCode = (event as any).keyCode;
    }
    if (keyCode === 'Enter') {
      console.log('KEY LAUNCH');
      this.tryLaunchingObjectQuery(false);
    }
  }

  optionToText(option: IObjectNameMatchResult) {
    // Neatly format displayed options to form:
    // "LongName1_______|_COMET"
    // "Name2___________|_ASTEROID"
    const wSpaces = this.lengthOfLongestDisplayText - option.display_text.length;
    return option.display_text + ' '.repeat(wSpaces > 0 ? wSpaces : 0) + ' | ' + option.body_type;
  }

  navToNeatDataPage = async (objid: string, displayText: string) => {
    const navigationExtras: NavigationExtras = {
      state: { objid, displayText }
    };
    await sleep(500);
    this.delayedRouter.delayedRouter('data', navigationExtras);
  };

  getInputTextColor() {
    const match = this.objectNameMatchResults.find(
      el => el.display_text === this.myForm.get('objectSearch')?.value
    );

    if (!!match) return { color: this.successColor };
    return null;
  }
}
