import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  TColInitState,
  TColName
} from '@client/app/core/services/neat-data/neat-initial-data-columns.service';
import { INeatObjectQueryResult } from '@client/app/models/neat-object-query-result.model';
import {
  selectNeatObjectQueryResults,
  selectNeatObjectQueryResultLabels,
  selectNeatObjectQueryColumnState,
  selectNeatObjectQuerySelectedResultIndex,
  selectNeatObjectDownloadRowState
} from '@client/app/ngrx/selectors/neat-object-query.selectors';
import { AppState } from '@client/app/ngrx/reducers';
import {
  INeatObjectQueryResultLabels,
  INeatObjectQueryResultLabel
} from '@client/app/models/neat-object-query-result-labels.model';
import { NeatDataPlotlyGraphDialogComponent } from '../neat-data-plotly-graph/neat-data-plotly-graph.dialog-component';
import {
  NeatObjectQuerySetSelectedResultIndex,
  NeatObjectQuerySetDownloadRowState
} from '@client/app/ngrx/actions/neat-object-query.actions';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-neat-data-table',
  templateUrl: './neat-data-table.component.html',
  styleUrls: ['./neat-data-table.component.scss']
})
export class NeatDataTableComponent implements OnInit, OnDestroy {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>

  // Track all subscriptions that will need removal
  subscriptions = new Subscription();

  selectedIndex = 0;

  deltaData!: number[];
  raData!: number[];
  decData!: number[];
  jdData!: number[];
  rhData!: number[];
  phaseData!: number[];
  tmtpData!: number[];
  trueanomalyData!: number[];

  isSelectAllDownloadRowCheckboxChecked = false;

  // Table Pagination Params
  // pageSizeOptions = [500, 1000, 10000];
  pageSizeOptions = [99999999999999];
  private paginator: MatPaginator | undefined;
  @ViewChild(MatPaginator) set setPaginator(content: MatPaginator) {
    this.paginator = content;
    if (!!this.tableData) {
      this.tableData.paginator = this.paginator;
    }
  }
  renderedTableData: any;

  // Table Sorting Params
  private sort: MatSort | undefined;
  @ViewChild(MatSort) set setSort(content: MatSort) {
    this.sort = content;
    if (!!this.tableData) {
      this.tableData.sort = this.sort;
    }
  }

  colState?: TColInitState;
  resultLabels!: INeatObjectQueryResultLabels;
  shownCols!: Partial<TColName>[];

  downloadRowState?: boolean[];

  rawResults?: INeatObjectQueryResult[];
  cleanedResults?: INeatObjectQueryResult[];
  tableData!: MatTableDataSource<INeatObjectQueryResult>;

  constructor(private store: Store<AppState>, private dialog: MatDialog) {
    // ---------------------------------------------------------------->>>

    this.subscriptions.add(
      this.store
        .select(selectNeatObjectQueryResults)
        .pipe(take(1))
        .subscribe(results => {
          this.rawResults = results;
          this.cleanedResults = results && [...results];
          this.processRawResults();
        })
    );

    this.subscriptions.add(
      this.store.select(selectNeatObjectQuerySelectedResultIndex).subscribe(selectedIndex => {
        this.selectedIndex = selectedIndex;
      })
    );

    this.subscriptions.add(
      this.store
        .select(selectNeatObjectQueryResultLabels)
        .pipe(take(1))
        .subscribe(resultLabels => {
          this.resultLabels = resultLabels;
        })
    );

    this.subscriptions.add(
      this.store.select(selectNeatObjectQueryColumnState).subscribe(colState => {
        this.colState = colState;
        this.shownCols = Object.keys(this.colState).filter(
          key => this.colState![key as keyof TColInitState]
        ) as TColName[];
      })
    );

    this.subscriptions.add(
      this.store.select(selectNeatObjectDownloadRowState).subscribe(downloadRowState => {
        this.downloadRowState = downloadRowState;
        // console.log(this.downloadRowState);
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  processRawResults() {
    if (!this.rawResults) return;

    // Extract data for plotly graphs
    this.raData = this.rawResults.map(el => el.ra);
    this.decData = this.rawResults.map(el => el.dec);
    this.deltaData = this.rawResults.map(el => el.delta);
    this.jdData = this.rawResults.map(el => el.jd);
    this.rhData = this.rawResults.map(el => el.rh);
    this.phaseData = this.rawResults.map(el => el.phase);
    this.tmtpData = this.rawResults.map(el => el.tmtp);
    this.trueanomalyData = this.rawResults.map(el => el.trueanomaly);

    // Mutate each result object by adding combined 'raDec' property
    this.cleanedResults?.forEach((el, ind) => {
      this.cleanedResults![ind] = { ...el, raDec: el.ra + ' / ' + el.dec };
    });

    // Determine array of page sizes
    const MAX_PAGINATION_VALUE = Math.max.apply(Math, this.pageSizeOptions);
    if (this.cleanedResults && this.cleanedResults.length > MAX_PAGINATION_VALUE) {
      this.pageSizeOptions.push(this.cleanedResults.length);
    }

    // Get data in format required for MatTable
    this.tableData = new MatTableDataSource(this.cleanedResults);

    this.tableData.connect().subscribe(d => (this.renderedTableData = d));
  }

  onClickPlotly(e: MouseEvent, plot: Partial<TColName>) {
    e.stopPropagation();

    // Only ra-dec plot is scatter
    const xDataKey = plot === 'raDec' ? 'ra' : plot;
    const yDataKey = plot === 'raDec' ? 'dec' : undefined;

    this.dialog.open<NeatDataPlotlyGraphDialogComponent, any>(NeatDataPlotlyGraphDialogComponent, {
      data: { xDataKey, yDataKey }
    });
  }

  getAllCols() {
    if (!this.shownCols) return [];
    return ['download_checkboxes', 'thumbnail_url', ...this.shownCols];
  }

  formatCellEntry(entry: any, labels?: INeatObjectQueryResultLabel) {
    // ------------------------->>>

    // If null (e.g. skymapper instrument), then print 'N/A'
    if (!entry) return 'N/A';

    if (typeof entry === 'number') return entry.toFixed(labels!.fractionSize);

    // Parse raDec, toFix, reassemble
    if (!!labels && labels.label === 'RA/Dec') {
      const [ra, dec] = entry
        .split('/')
        .map((el: string) => parseFloat(el.trim()).toFixed(labels!.fractionSize));
      return ra + ' / ' + dec;
    }
    return entry;
  }

  getLinkLabel(labels?: INeatObjectQueryResultLabel) {
    //

    if (!labels) return '';

    return labels.label.toUpperCase();

    /*     if (labels.label.toLowerCase().includes('archive')) return labels.label.toUpperCase();
    if (labels.label.toLowerCase().includes('archive')) return labels.label.toUpperCase(); */
  }

  selectRow(index: number) {
    this.store.dispatch(new NeatObjectQuerySetSelectedResultIndex({ index }));
  }

  openSettingsDialog(e: MouseEvent) {
    e.stopPropagation();
    this.dialog.open<NeatDataTableWrapperComponent>(NeatDataTableWrapperComponent);
  }

  getLabelDescription(labels?: INeatObjectQueryResultLabel) {
    if (!labels) return '';
    return labels.description;
  }

  updateDownloadRowCheckbox(rowIndex: number) {
    if (!!this.downloadRowState) {
      // Toggle entry
      let newDownloadRowState = [...this.downloadRowState];
      newDownloadRowState[rowIndex] = !newDownloadRowState[rowIndex];
      this.store.dispatch(new NeatObjectQuerySetDownloadRowState({ newDownloadRowState }));
    }
  }

  selectAllDownloadRowCheckbox() {
    this.isSelectAllDownloadRowCheckboxChecked = !this.isSelectAllDownloadRowCheckboxChecked;

    const newDownloadRowState =
      this.cleanedResults &&
      Array.apply(null, {
        length: this.cleanedResults.length
      }).map(() => this.isSelectAllDownloadRowCheckboxChecked);

    newDownloadRowState &&
      this.store.dispatch(new NeatObjectQuerySetDownloadRowState({ newDownloadRowState }));
  }
}

@Component({
  selector: 'app-neat-data-checkboxes-wrapper',
  template: `
    <div style="width: 500px; max-width: 60vw; height: 500px;">
      <app-neat-data-checkboxes></app-neat-data-checkboxes>
    </div>
  `
})
export class NeatDataTableWrapperComponent {}
