import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { fadeAnimation } from '../../../shared/animations/route-animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { IResponse } from '../../../shared/interfaces/response-i';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-contact-us',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  animations: [fadeAnimation],
})
export class ContactUsComponent {
  contactUsForm: FormGroup;
  phone: string = environment.phone;
  mail: string = environment.mail;
  location: string = environment.location;

  constructor(private fb: FormBuilder,
    private commonService: CommonService,
    private _snackbar: SnackbarService
  ) {
    this.contactUsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  submitContactusDetails = () => {
    console.log(this.contactUsForm.value);
    this.commonService.contactus(this.contactUsForm.value).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          this._snackbar.success(
              'Contact details sent successfully.'
            );
        } else {
          this._snackbar.error(response?.msg);
        }
      },
      error: (err) => {
        this._snackbar.error(
          err?.msg ||
            err?.message ||
            'Something went wrong, please try again later.'
        );
      },
    });
  }
}
