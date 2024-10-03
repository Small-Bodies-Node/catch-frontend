import { Component, HostListener, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  standalone: true,
  imports: [
    //
    MatFormFieldModule,
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
