import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { fadeAnimation } from '../../../shared/animations/route-animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(private fb: FormBuilder) {
    this.contactUsForm = this.fb.group({
      name: [''],
      email: [''],
      message: [''],
      city: [''],
      state: [''],
      country: [''],
      phone: [''],
    });
  }
}
