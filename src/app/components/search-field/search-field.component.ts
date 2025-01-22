import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { IAppState } from '../../ngrx/reducers';
import { IObjectNameMatchResult } from '../../../models/IObjectNameMatchResult';
import { selectObjectNameMatchResults } from '../../ngrx/selectors/object-name-match.selectors';
import { selectApiDataStatus } from '../../ngrx/selectors/api-data.selectors';
import { ObjectNameMatchAction_FetchResults } from '../../ngrx/actions/object-name-match.actions';
import { UnrecognizedNameDialogComponent } from './unrecognized-name-dialog.component';
import {
  ApiDataAction_FetchResult,
  ApiDataAction_SetStatus,
} from '../../ngrx/actions/api-data.actions';
import {
  formControlLabels,
  formControlDict,
  TControlKeyForGroupForm,
} from '../../../models/TControlKeyForGroupForm';
import { SharedModule } from '../../shared/shared.module';
import {
  controlKeysForSources,
  TControlKeyForSources,
} from '../../../models/TControlKeyForSources';
import { toolTipTextDict } from '../../../utils/toolTipTextDict';
import {
  intersectionTypeLabels,
  intersectionTypes,
} from '../../../models/TIntersectionType';
import { fixedTargets } from '../../../utils/fixedTargets';
import { pastelGreen, pastelPink } from '../../../utils/constants';
import {
  ApiFixedAction_FetchResult,
  ApiFixedAction_SetStatus,
} from '../../ngrx/actions/api-fixed.actions';
import { TMovingVsFixed } from '../../../models/TMovingVsFixed';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  // --->>>

  @ViewChild(MatAutocompleteTrigger)
  autocomplete!: MatAutocompleteTrigger;

  intersectionTypes = intersectionTypes;
  intersectionTypeLabels = intersectionTypeLabels;
  sources = controlKeysForSources;
  toolTipText = toolTipTextDict;
  fixedTargets = fixedTargets;
  formControlLabels = formControlLabels;
  formGroup: FormGroup<typeof formControlDict>;

  objectNameMatchResults: IObjectNameMatchResult[] = [];
  searchMessage = 'Search For Object';
  lengthOfLongestDisplayText = 0;
  latestInputText = '';
  latestMovingVsFixed: TMovingVsFixed = 'moving';
  errorMessage = '';

  isAdvancedControls = false;
  isMovingTarget = true;
  isAllSourcesSelected = true;

  subscriptions = new Subscription();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store$: Store<IAppState>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // --->>>

    this.formGroup = new FormGroup(formControlDict);

    this.subscriptions.add(
      this.store$.select(selectObjectNameMatchResults).subscribe((results) => {
        this.objectNameMatchResults = results;
        this.lengthOfLongestDisplayText = results
          .map((el) => el.display_text.length)
          .reduce((acc, el) => {
            return Math.max(acc, el);
          }, 0);
      })
    );

    this.subscriptions.add(
      this.store$.select(selectApiDataStatus).subscribe((status) => {
        if (status.code === 'searching') {
          this.isAdvancedControls = false;
        }
      })
    );

    this.subscriptions.add(
      this.formGroup.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe((value) => {
          //

          // Moving-vs-fixed logic
          this.updateMovingVsFixed(value['toggle_moving_vs_fixed_control']);

          // Sources-checkbox logic
          this.updateSourcesCheckboxes(!!value['select_all_sources_control']);

          // Search-field-dropdown logic
          this.updateSearchField(value['search_field_control']);
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
  isTargetMatched(inputText?: string) {
    const text = inputText || this.latestInputText.trim();
    const match = this.objectNameMatchResults.find(
      (el) => el.target === text.trim()
    );
    return !!match;
  }

  updateSourcesCheckboxes(isSelectAllSources: boolean) {
    /**
     * Check if change to select-all-sources checkbox;
     * change all sources accordingly
     */
    if (isSelectAllSources !== this.isAllSourcesSelected) {
      this.isAllSourcesSelected = isSelectAllSources;
      controlKeysForSources.forEach((controlKeyForSources) => {
        this.formGroup.controls[controlKeyForSources].setValue(
          isSelectAllSources,
          { emitEvent: false }
        );
      });
    }
    this.updateSearchFieldErrors();
  }

  updateSearchField(inputText?: string) {
    if (typeof inputText === 'undefined') return;

    if (this.latestInputText !== inputText) {
      this.latestInputText = inputText;
      if (this.isMovingTarget) {
        this.store$.dispatch(
          ObjectNameMatchAction_FetchResults({
            searchTerm: this.latestInputText,
          })
        );
      }
      this.updateSearchFieldErrors();
    }
  }

  updateMovingVsFixed(movingVsFixed: TMovingVsFixed | undefined) {
    if (!movingVsFixed || movingVsFixed === this.latestMovingVsFixed) return;

    // Change moving-vs-fixed state
    this.latestMovingVsFixed = movingVsFixed;
    this.formGroup.controls.search_field_control.setValue('');

    if (movingVsFixed === 'moving') {
      this.isMovingTarget = true;
    } else {
      this.isMovingTarget = false;
    }
  }

  isAtleastOneSourceSelected() {
    return controlKeysForSources.some((controlKeyForSources) => {
      return !!this.formGroup.controls[controlKeyForSources].value;
    });
  }

  getSelectAllSourcesLabel() {
    const isSelected =
      !!this.formGroup.controls.select_all_sources_control.value;
    return isSelected ? 'Deselect All Sources' : 'Select All Sources';
  }

  getSelectAllSourcesLabelColor() {
    const isSelected =
      !!this.formGroup.controls.select_all_sources_control.value;
    return isSelected ? '#FFD1DC' : '#77DD77';
  }

  submitObjectNameMatch(e: MouseEvent) {
    e.stopPropagation();
    if (this.isMovingTarget) {
      this.tryLaunchingMovingObjectQuery();
    } else {
      this.tryLaunchingFixedObjectQuery();
    }
  }

  getSearchMessageText() {
    if (this.latestInputText.length === 0) {
      return this.isMovingTarget
        ? 'Search for moving object'
        : 'Search for fixed target';
    }

    if (this.isMovingTarget) {
      const target = this.latestInputText.trim();
      const match = this.objectNameMatchResults.find(
        (el) => el.target === target
      );
      if (!!match) return 'Match: ' + match.display_text;

      return this.isAtleastOneSourceSelected()
        ? 'Unrecognized. Search anyway?'
        : 'Unrecognized.';
    } else {
      return 'Search for fixed target';
    }
  }

  tryLaunchingMovingObjectQuery() {
    // Ensure at least one source is selected
    const sources: TControlKeyForSources[] = [];
    controlKeysForSources.forEach((key) => {
      if (this.formGroup.get(key)?.value) {
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
    if (this.isTargetMatched(target)) {
      this.launchMovingObjectQuery(target, sources);
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
            if (!!isSearchConfirmed) {
              this.launchMovingObjectQuery(target, sources);
            }
          })
        );
      }, 0);
    }
  }

  tryLaunchingFixedObjectQuery() {
    // Ensure at least one source is selected
    const sources: TControlKeyForSources[] = [];
    controlKeysForSources.forEach((key) => {
      if (this.formGroup.get(key)?.value) {
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

    // Check ra dec is splittable
    const raDec = this.latestInputText.trim();
    const raDecSplit = raDec.split(' ');
    const ra = raDecSplit[0];
    const dec = raDecSplit[1];
    if (raDecSplit.length === 2 && ra.length > 0 && dec.length > 0) {
      this.launchFixedObjectQuery(ra, dec, sources);
      return;
    }

    // !Add some logic to explain to use that ra-dec is malformed
  }

  launchMovingObjectQuery(target: string, sources: TControlKeyForSources[]) {
    const isCached = this.formGroup.controls.use_cached_results_control.value;
    const isUncertaintyEllipse =
      this.formGroup.controls.uncertainty_ellipse_control.value;
    const padding = this.formGroup.controls.padding_input_control.value;

    this.autocomplete.closePanel();
    this.store$.dispatch(
      ApiDataAction_SetStatus({
        query: { target, isCached, isUncertaintyEllipse, padding, sources },
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

  launchFixedObjectQuery(
    ra: string,
    dec: string,
    sources: TControlKeyForSources[]
  ) {
    const radius = this.formGroup.controls.padding_input_control.value;
    const intersectionType =
      this.formGroup.controls.intersection_type_input_control.value;
    const startDate = this.formGroup.controls.start_time_input_control.value;
    const stopDate = this.formGroup.controls.stop_time_input_control.value;

    this.autocomplete.closePanel();
    this.store$.dispatch(
      ApiFixedAction_SetStatus({
        query: {
          ra,
          dec,
          intersectionType,
          radius,
          startTime: startDate,
          stopTime: stopDate,
          sources,
        },
        message: 'Starting fixed-target search....',
        code: 'searching',
      })
    );
    this.store$.dispatch(
      ApiFixedAction_FetchResult({
        ra,
        dec,
        intersectionType,
        radius,
        startTime: startDate,
        stopTime: stopDate,
        sources,
      })
    );
  }

  keyDownOnUpperFormInputText(event: KeyboardEvent) {
    if (this.isSearchFieldError()) return;
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
      if (this.isMovingTarget) {
        return this.tryLaunchingMovingObjectQuery();
      }
      return this.tryLaunchingFixedObjectQuery();
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
    if (this.isTargetMatched()) return { color: pastelGreen };
    return null;
  }

  toggleAdvancedControls() {
    this.isAdvancedControls = !this.isAdvancedControls;
  }

  getPlaceholderText() {
    return this.isMovingTarget ? 'E.g. 65P' : 'E.g. Crab Nebula';
  }

  getFormControlKey(input: TControlKeyForGroupForm) {
    // Used for type safety in HTML template
    return input;
  }

  isSearchButtonDisabled() {
    const isAtleastOneSourceSelected = this.isAtleastOneSourceSelected();
    const isInputEmpty = this.latestInputText.trim().length === 0;
    return isInputEmpty || !isAtleastOneSourceSelected;
  }

  getSearchButtonStyle() {
    const isInputEmpty = this.latestInputText.trim().length === 0;
    const isTargetMatched = this.isTargetMatched(this.latestInputText);
    if ((!isInputEmpty && isTargetMatched) || !this.isMovingTarget) {
      return { 'background-color': pastelGreen, color: 'black' };
    }
    return { backgroundColor: pastelPink, color: 'black' };
  }

  isSearchFieldError() {
    const isTargetUnrecognized =
      !!this.formGroup.controls.search_field_control.errors?.[
        'isTargetUnrecognized'
      ];
    const isSourceNeeded =
      !!this.formGroup.controls.search_field_control.errors?.['isSourceNeeded'];
    const output = !!isTargetUnrecognized || !!isSourceNeeded;
    return output;
  }

  updateSearchFieldErrors() {
    //

    if (!this.isMovingTarget) {
      if (!this.isAtleastOneSourceSelected()) {
        this.errorMessage = 'You must select at least one Data Source';
        this.formGroup.controls.search_field_control.setErrors({
          isSourceNeeded: true,
        });
        return;
      }
      // For now, no errors for fixed-target searches except for missing sources
      this.formGroup.controls.search_field_control.setErrors(null);
      return;
    }

    const isAtleastOneSourceSelected = this.isAtleastOneSourceSelected();
    const isTargetMatched = this.isTargetMatched(this.latestInputText);
    const isInputEmpty = this.latestInputText.trim().length === 0;

    if (isInputEmpty) {
      this.formGroup.controls.search_field_control.setErrors(null);
    } else {
      if (!isAtleastOneSourceSelected) {
        this.errorMessage = 'You must select at least one Data Source';
        this.formGroup.controls.search_field_control.setErrors({
          isSourceNeeded: true,
        });
      } else {
        this.errorMessage = '';
      }
      if (!isTargetMatched) {
        this.formGroup.controls.search_field_control.setErrors({
          isTargetUnrecognized: true,
        });
      } else {
        this.formGroup.controls.search_field_control.setErrors(null);
      }
    }
    this.changeDetectorRef.detectChanges();
  }
}
