import { Component, HostListener, Inject, NgZone } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-unrecognized-name-dialog',
  template: `
    <h2 mat-dialog-title>Warning!</h2>
    <mat-dialog-content>
      The target "{{ data.submittedText }}" is not recognized by our
      name-resolution service.
    </mat-dialog-content>
    <mat-dialog-actions>
      <button
        mat-button
        mat-dialog-close
        cdkFocusInitial
        (click)="closeDialog(true)"
      >
        SEARCH ANYWAY
      </button>
      <button mat-button mat-dialog-close (click)="closeDialog(false)">
        CANCEL
      </button>
    </mat-dialog-actions>
  `,
  styles: [``],
  imports: [
    MatFormFieldModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatButton,
  ],
})
export class UnrecognizedNameDialogComponent {
  // --->>>

  constructor(
    public dialogRef: MatDialogRef<UnrecognizedNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { submittedText: string },
    private ngZone: NgZone
  ) {}

  closeDialog(isSearchConfirmed: boolean) {
    console.log('CLOSING DIALOG', isSearchConfirmed);
    this.ngZone.run(() => {
      this.dialogRef.close(isSearchConfirmed);
    });
  }

  @HostListener('keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    event.preventDefault(); // Prevent ENTER key from triggering any actions
  }
}
