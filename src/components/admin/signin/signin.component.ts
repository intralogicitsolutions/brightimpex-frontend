import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../../shared/services/common.service';
import { IResponse } from '../../../shared/interfaces/response-i';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  animations: [fadeAnimation],
})
export class SigninComponent {
  signinForm!: FormGroup;
  hide = signal(true);

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private _snackbar: SnackbarService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  showPasswordToggle(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    const body = this.signinForm.value;
    this.commonService.signIn(body).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1 && response?.body) {
          this._snackbar.success(response?.msg);
          localStorage.setItem('user_details', JSON.stringify(response?.body));
          localStorage.setItem('token', response?.body?.token);
          this.router.navigate(['/home']);
        } else {
          this._snackbar.error(response?.msg);
        }
      },
      error: (err) => {
        this._snackbar.error(
          err?.msg || 'Something went wrong, please try again later'
        );
      },
    });
  }
}
