import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { MatSnackBar } from '@angular/material/snack-bar';
import { TSources } from '../../models/TSources';
import { sourcesNamesDict } from '../../../utils/sourcesNamesDict';
import { IObjectNameMatchResult } from '../../models/IObjectNameMatchResult';
import { IAppState } from '../../ngrx/reducers';
import { selectObjectNameMatchResults } from '../../ngrx/selectors/object-name-match.selectors';
import { selectApiStatus } from '../../ngrx/selectors/api-data.selectors';
import { ObjectNameMatchAction_FetchResults } from '../../ngrx/actions/object-name-match.actions';
import { UnrecognizedNameDialogComponent } from './unrecognized-name-dialog.component';
import {
  ApiDataAction_FetchResult,
  ApiDataAction_SetStatus,
} from '../../ngrx/actions/api-data.actions';

type TFormControlKeys =
  | TSources
  | 'use_cached_results_control'
  | 'uncertainty_ellipse_control'
  | 'padding_input_control'
  | 'target_input_control';

const formControlLabels: {
  [K in TFormControlKeys]: string;
} = {
  target_input_control: 'Target Input',
  ...sourcesNamesDict,
  use_cached_results_control: 'Use Cached Results',
  uncertainty_ellipse_control: 'Uncertainty Ellipse',
  padding_input_control: 'Extra Padding',
};

type TControlsForm = {
  [K in (typeof formControlLabels)[TFormControlKeys]]:
    | FormControl<boolean | null>
    | FormControl<number | null>
    | FormControl<string | null>;
};

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  // --->>>

  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;

  basicSearchForm: FormGroup;
  advancedSearchForm: FormGroup;
  formControlLabels = formControlLabels;

  objectNameMatchResults: IObjectNameMatchResult[] = [];
  searchMessage = 'Search For Object';
  lengthOfLongestDisplayText = 0;
  latestInputText = '';
  successColor = '#689F38'; // mat-green
  searchTermChangeSubject: Subject<string> = new Subject<string>();

  isAdvancedControls = false;

  subscriptions = new Subscription();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store$: Store<IAppState>
  ) {
    // --->>>

    // Define form groups
    this.basicSearchForm = new FormGroup<TControlsForm>({
      [formControlLabels.target_input_control]: new FormControl(
        this.latestInputText
      ),
    });
    this.advancedSearchForm = new FormGroup<TControlsForm>({
      [formControlLabels.neat_palomar_tricam]: new FormControl(true),
      [formControlLabels.neat_maui_geodss]: new FormControl(true),
      [formControlLabels.catalina_bigelow]: new FormControl(true),
      [formControlLabels.catalina_bokneosurvey]: new FormControl(true),
      [formControlLabels.catalina_lemmon]: new FormControl(true),
      [formControlLabels.ps1dr2]: new FormControl(true),
      [formControlLabels.skymapper]: new FormControl(true),
      [formControlLabels.spacewatch]: new FormControl(true),
      //
      [formControlLabels.use_cached_results_control]: new FormControl(true),
      [formControlLabels.uncertainty_ellipse_control]: new FormControl(false),
      //
      [formControlLabels.padding_input_control]: new FormControl(0),
    });

    this.subscriptions.add(
      this.store$.select(selectObjectNameMatchResults).subscribe((results) => {
        this.objectNameMatchResults = results;
        // Compute length of longest display text
        this.lengthOfLongestDisplayText = results
          .map((el) => el.display_text.length)
          .reduce((acc, el) => {
            return Math.max(acc, el);
          }, 0);
      })
    );

    this.subscriptions.add(
      this.store$.select(selectApiStatus).subscribe((status) => {
        // this.isWaitingForData = !!status && status.code === 'searching';
        if (status.code === 'searching') {
          this.isAdvancedControls = false;
        }
      })
    );

    // When the text of the input field updates, call the name-search api
    this.subscriptions.add(
      this.searchTermChangeSubject
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe((latestInputText) => {
          this.latestInputText = latestInputText;
          this.store$.dispatch(
            ObjectNameMatchAction_FetchResults({ searchTerm: latestInputText })
          );
        })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Check to see if the text entered into the search box is a target within
   * 'objectNameMatchResults'
   */
  isTargetMatched() {
    const match = this.objectNameMatchResults.find(
      (el) => el.target === this.latestInputText.trim()
    );
    return !!match;
  }

  submitObjectNameMatch(e: MouseEvent) {
    e.stopPropagation();
    this.tryLaunchingObjectQuery();
  }

  getSearchMessageText() {
    if (this.latestInputText.length === 0) {
      return 'Search for Astronomical Object';
    }

    const target = this.latestInputText.trim();
    const match = this.objectNameMatchResults.find(
      (el) => el.target === target
    );
    if (!!match) return 'Match: ' + match.display_text;

    return 'Object Not Recognized (But Still Searchable)';
  }

  getFormColor(): 'primary' | 'accent' | 'warn' {
    if (!this.latestInputText.length || !this.objectNameMatchResults.length)
      return 'primary';
    if (this.isTargetMatched()) return 'accent';
    return 'warn';
  }

  tryLaunchingObjectQuery() {
    // Ensure at least one source is selected
    const sources: TSources[] = [];
    Object.keys(sourcesNamesDict).forEach((key) => {
      const val = sourcesNamesDict[key as keyof typeof sourcesNamesDict];
      if (this.advancedSearchForm.get(val)?.value) {
        sources.push(key as any);
      }
    });
    if (!sources.length) {
      this.snackBar.open(`You must select at least one Data Source`, 'Close', {
        duration: 5000,
      });
      this.isAdvancedControls = true;
      return;
    }

    // Ensure a name is selected
    const target = this.latestInputText.trim();

    if (this.isTargetMatched()) {
      this.launchObjectQuery(target, sources);
      return;
    }

    if (!this.dialog.openDialogs.length) {
      setTimeout(() => {
        // If target isn't matched, give user option to search anyway
        const dialogRef = this.dialog.open<
          UnrecognizedNameDialogComponent,
          any
        >(UnrecognizedNameDialogComponent, { data: { submittedText: target } });

        this.subscriptions.add(
          dialogRef.afterClosed().subscribe((isSearchConfirmed) => {
            console.log(
              'Request received: >>>',
              isSearchConfirmed,
              '<<<',
              typeof isSearchConfirmed
            );
            if (!!isSearchConfirmed) {
              this.launchObjectQuery(target, sources);
            }
          })
        );
      }, 0);
    }
  }

  launchObjectQuery(target: string, sources: TSources[]) {
    // Isolate optional params
    const isCached = this.advancedSearchForm.get(
      formControlLabels.use_cached_results_control
    )?.value;
    const isUncertaintyEllipse = this.advancedSearchForm.get(
      formControlLabels.uncertainty_ellipse_control
    )?.value;
    const padding =
      this.advancedSearchForm.get(formControlLabels.padding_input_control)
        ?.value || 0;

    //
    this.autocomplete.closePanel();
    this.store$.dispatch(
      ApiDataAction_SetStatus({
        query: {
          target,
          isCached,
          isUncertaintyEllipse,
          padding,
          sources,
        },
        message: 'Starting search....',
        code: 'searching',
      })
    );
    this.store$.dispatch(
      ApiDataAction_FetchResult({
        target,
        isCached,
        padding,
        isUncertaintyEllipse,
        sources,
      })
    );
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
      this.tryLaunchingObjectQuery();
    }
  }

  optionToText(option: IObjectNameMatchResult) {
    // Neatly format displayed options to form:
    // "LongName1_______|_COMET"
    // "Name2___________|_ASTEROID"
    const wSpaces =
      this.lengthOfLongestDisplayText - option.display_text.length;
    return (
      option.display_text +
      ' '.repeat(wSpaces > 0 ? wSpaces : 0) +
      ' | ' +
      option.body_type
    );
  }

  getInputTextColor() {
    const match = this.objectNameMatchResults.find(
      (el) =>
        el.display_text ===
        this.basicSearchForm.get(formControlLabels.target_input_control)?.value
    );

    if (!!match) return { color: this.successColor };
    return null;
  }

  toggleAdvancedControls() {
    this.isAdvancedControls = !this.isAdvancedControls;
  }

  getSearchButtonIconText() {
    return 'search';
  }
}
