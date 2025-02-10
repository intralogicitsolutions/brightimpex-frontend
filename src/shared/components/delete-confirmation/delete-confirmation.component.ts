import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-confirmation',
  imports: [MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.scss',
})
export class DeleteConfirmationComponent {
  constructor(
    private matDialogRef: MatDialogRef<DeleteConfirmationComponent>
  ) {}

  confirm() {
    this.matDialogRef.close('confirm');
  }
}
