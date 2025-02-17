import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { IResponse } from '../../../shared/interfaces/response-i';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  animations: [fadeAnimation],
})
export class SignupComponent {
  signupForm!: FormGroup;
  hide = signal(true);

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private _snackbar: SnackbarService
  ) {
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  showPasswordToggle(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    const body = this.signupForm.value;
    this.commonService.signUp(body).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          this._snackbar.success(response?.msg);
        } else {
          this._snackbar.error(response?.msg);
        }
      },
      error: (err) => {
        console.log(err);
        this._snackbar.error(err?.msg);
      },
    });
  }
}
