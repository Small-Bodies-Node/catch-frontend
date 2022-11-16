import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-unrecognized-name-dialog',
  template: `
    <form
      style="display: flex; flex-direction: column; justify-content: center; align-items: center; "
    >
      <mat-label> Warning! </mat-label>
      <mat-label>
        The target "{{ data.submittedText }}" is not recognized by our
        name-resolution service
      </mat-label>
      <div>
        <button mat-raised-button mat-dialog-close (click)="closeDialog(true)">
          SEARCH ANYWAY
        </button>
        <button mat-raised-button mat-dialog-close (click)="closeDialog(false)">
          CANCEL
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      * {
        /* background-color: green; */
        margin: 5px;
      }
    `,
  ],
})
export class UnrecognizedNameDialogComponent {
  // --->>>

  constructor(
    public dialogRef: MatDialogRef<UnrecognizedNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { submittedText: string }
  ) {}

  closeDialog(isSearchConfirmed: boolean) {
    this.dialogRef.close(isSearchConfirmed);
  }
}
